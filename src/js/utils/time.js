import { timeFormat, utcParse } from 'd3-time-format';

const GMT_TIMESTAMP_FORMAT = '%Y%m%d-%H%M%S';
const READABLE_DATE_FORMAT = '%Y/%m/%d';

// Parse timestamp in GMT (default when locale is not provided)
const parser = utcParse(GMT_TIMESTAMP_FORMAT);
// The parsed should based on client system's locale
const formatter = timeFormat(READABLE_DATE_FORMAT);

const convertTimestamp = (timestamp) => formatter(parser(timestamp));

export {
  convertTimestamp as default,
};
