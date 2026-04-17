const fs = require('fs');
const path = require('path');

/**
 * Docusaurusプラグイン: docs階層に基づきCSSをカスケード解決し、
 * static/styles-cascade/ にコピーしてグローバルデータとして公開する
 */
module.exports = function styleCascadePlugin(context, options) {
  return {
    name: 'docusaurus-plugin-style-cascade',

    async loadContent() {
      const docsDir = path.resolve(context.siteDir, options.docsDir || '../docs');
      const baseUrl = context.baseUrl || '/';
      const map = {}; // routePath -> css URL

      // ディレクトリ内のCSSファイルとMDファイル名（拡張子なし）を列挙する
      function listCssDocs(dir) {
        let entries;
        try {
          entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
          return { cssFiles: [], mdFiles: [], docNames: new Set() };
        }
        const cssFiles = entries.filter(e => e.isFile() && e.name.endsWith('.css')).map(e => e.name);
        const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md')).map(e => e.name.replace(/\.md$/, ''));
        const docNames = new Set(mdFiles);
        return { cssFiles, mdFiles, docNames };
      }

      // フォルダデフォルトCSS（MD名と一致しないCSS）を返す
      function findFolderDefault(dir, docNames) {
        const { cssFiles } = listCssDocs(dir);
        const candidates = cssFiles
          .filter(n => !docNames.has(n.replace(/\.css$/, '')))
          .sort();
        return candidates[0] || null;
      }

      // MDファイルに対して適用すべきCSSの絶対パスを解決する
      function resolveCss(absMdPath) {
        const docName = path.basename(absMdPath, '.md');
        let dir = path.dirname(absMdPath);
        while (true) {
          const { cssFiles, docNames } = listCssDocs(dir);
          // 1. ドキュメント固有CSS
          const specific = `${docName}.css`;
          if (cssFiles.includes(specific)) return path.join(dir, specific);
          // 2. フォルダデフォルトCSS
          const folderDefault = findFolderDefault(dir, docNames);
          if (folderDefault) return path.join(dir, folderDefault);
          // 3. 親ディレクトリへ再帰
          if (dir === docsDir || !dir.startsWith(docsDir)) return null;
          const parent = path.dirname(dir);
          if (parent === dir) return null;
          dir = parent;
        }
      }

      // docs以下のすべてのMDファイルを収集する
      function walk(dir, results = []) {
        let entries;
        try {
          entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
          return results;
        }
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full, results);
          else if (e.isFile() && e.name.endsWith('.md')) results.push(full);
        }
        return results;
      }

      const mdFiles = walk(docsDir);
      const staticOut = path.join(context.siteDir, 'static', 'styles-cascade');
      fs.rmSync(staticOut, { recursive: true, force: true });
      fs.mkdirSync(staticOut, { recursive: true });
      const copiedCss = new Map(); // absCssPath -> servedFilename

      for (const md of mdFiles) {
        const cssAbs = resolveCss(md);
        if (!cssAbs) continue;
        let served = copiedCss.get(cssAbs);
        if (!served) {
          // ドキュメントルートからの相対パスをファイル名に変換する
          const rel = path.relative(docsDir, cssAbs).replace(/[/\\]/g, '__');
          served = rel;
          fs.copyFileSync(cssAbs, path.join(staticOut, served));
          copiedCss.set(cssAbs, served);
        }
        // MDファイルのルートURLを算出する（Docusaurusのroutepath規則に準拠：各セグメント先頭の `数字-` 接頭辞は除去される）
        const relMd = path.relative(docsDir, md).replace(/\.md$/, '').replace(/\\/g, '/');
        const stripped = relMd.split('/').map(seg => seg.replace(/^\d+-/, '')).join('/');
        const variants = new Set([baseUrl + relMd, baseUrl + stripped]);
        for (const v of variants) {
          map[v] = baseUrl + 'styles-cascade/' + served;
        }
      }

      // クライアントからfetchできるようにJSONマップも書き出す
      fs.writeFileSync(path.join(staticOut, '_map.json'), JSON.stringify(map));

      return { map };
    },

    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData({ map: content.map });
    },
  };
};
