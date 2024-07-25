// 需要再项目初始化定义
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

const DAY_JS_LOCALE_MAP: any = {
  zh_CN: 'zh-cn',
  en_US: 'en',
};

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale(DAY_JS_LOCALE_MAP[currentLanguage] || 'en');



// TimeZone 组件
import { memo } from 'react'
import dayjs, { Dayjs } from 'dayjs';

export const DATE_FORMAT = 'YYYY/MM/DD'

interface IProps {
  tz?: 'PST';
  format?: string;
  time: string | Dayjs | number;
}

const TZ_MAP = {
  PST: 'America/Los_Angeles',
}

// how to use 
// <TimeZone time={value} format="YYYY-MM-DD HH:mm:ss" />

const TimeZone = (props: IProps) => {
  const { tz = 'PST', format = DATE_FORMAT, time } = props;

  if (!time) return null;

  const formatTime = dayjs(time).tz(TZ_MAP[tz]).format(format);

  return `${formatTime} (${tz})`;
}

export default memo(TimeZone);
