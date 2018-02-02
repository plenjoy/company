import React from 'react';

import BookCover from '../../BookCover';
import BookSheet from '../../BookSheet';

export const getBookSpread = (data, actions, spreadId) => {
  const { isCover } = data;

  if(isCover) {
    return <BookCover key={spreadId} data={data} actions={actions} />;
  } else {
    return <BookSheet key={spreadId} data={data} actions={actions} />;
  }
};
