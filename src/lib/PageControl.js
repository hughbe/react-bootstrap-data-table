import React from 'react';

import '../css/PageControl.css';

const handleOnClick = (event, onClick) => {
  event.preventDefault();
  event.stopPropagation();
  onClick && onClick();
}

const PageItem = ({ className, onClick, children }) => (
  <li className={`page-item ${className || ''}`}>
    <a href="#" className="page-link" onClick={event => handleOnClick(event, onClick)}>
      {children}
    </a>
  </li>
);

const PageControl = ({ pageNumber, numberOfPages, toShow = 2, onPageChanged, className }) => {
  pageNumber = +pageNumber;
  numberOfPages = +numberOfPages;
  if (pageNumber < 1 || pageNumber > numberOfPages) {
    pageNumber = 1;
  }

  // The user can customize how many items to show on the left and right of the
  // current page indicator.
  var leftIndexEnd = pageNumber - toShow;
  var rightIndexEnd = pageNumber + toShow;

  if (leftIndexEnd < 1) {
    // There is not enough to show on the left hand side. To maintain a constant
    // width of the pagination control, increase the number of page indicators on
    // the right hand side.
    const extraOnRight = 1 - leftIndexEnd;
    rightIndexEnd += extraOnRight;
    leftIndexEnd = 1;
  }
  if (rightIndexEnd > numberOfPages) {
    // There is not enought to show on the right hand side. To maintain a constant
    // width of the pagination control, increase the number of page indicators on
    // the left hand side.
    leftIndexEnd -= rightIndexEnd - numberOfPages;
    rightIndexEnd = numberOfPages;

    // But, if we increased the number of page indicators on the left side, there
    // might not be enough to show on the left hand side again.
    if (leftIndexEnd < 1) {
      leftIndexEnd = 1;
    }
  }

  // Add all the indicators on the left hand side.
  const leftItems = [];
  for (let left = leftIndexEnd; left < pageNumber; left++) {
    leftItems.push(<PageItem key={left} onClick={() => onPageChanged(left)}>{left}</PageItem>);
  }

  // Add all the indicators on the right hand side.
  const rightItems = [];
  for (let right = pageNumber + 1; right <= rightIndexEnd; right++) {
    rightItems.push(<PageItem key={right} onClick={() => onPageChanged(right)}>{right}</PageItem>);
  }

  return (
    <ul className={`pagination ${className || ''}`}>
      <PageItem onClick={() => onPageChanged(1)}>1</PageItem>
      <PageItem className={pageNumber === 1 && 'disabled'} onClick={() => onPageChanged(pageNumber - 1)}>«</PageItem>
      {leftItems}
      <PageItem className="active" onClick={() => onPageChanged(pageNumber)}>{pageNumber}</PageItem>
      {rightItems}
      <PageItem className={pageNumber === numberOfPages && 'disabled'} onClick={() => onPageChanged(pageNumber + 1)}>»</PageItem>
      <PageItem onClick={() => onPageChanged(numberOfPages)}>{numberOfPages}</PageItem>
    </ul>
  );
};
export default PageControl;