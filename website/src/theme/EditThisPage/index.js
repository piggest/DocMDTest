import React from 'react';
import Translate from '@docusaurus/Translate';
import IconEdit from '@theme/Icon/Edit';

export default function EditThisPage({ editUrl }) {
  const prefix = 'https://github.com/piggest/ConiferFruits/edit/main/docs/';
  const docPath = editUrl.startsWith(prefix) ? editUrl.slice(prefix.length) : '';
  const appUrl = docPath
    ? `cnfr://edit?path=${encodeURIComponent('docs/' + docPath)}`
    : null;

  return (
    <>
      {appUrl && (
        <a href={appUrl} className="theme-edit-this-page" style={{ marginRight: 12 }}>
          <IconEdit />
          <Translate
            id="theme.common.editThisPage.app"
            description="App edit link">
            デスクトップアプリで編集
          </Translate>
        </a>
      )}
      <a href={editUrl} target="_blank" rel="noreferrer noopener" className="theme-edit-this-page">
        <IconEdit />
        <Translate
          id="theme.common.editThisPage"
          description="GitHub edit link">
          GitHub で編集
        </Translate>
      </a>
    </>
  );
}
