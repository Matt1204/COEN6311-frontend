import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function getNextDayToSubmit(): dayjs.Dayjs {
  const today = dayjs();
  const dayOfWeek = today.day(); // day() returns the day of the week where Sunday is 0 and Saturday is 6

  // const daysUntilNextMonday = (dayOfWeek === 0 ? 1 : 8 - dayOfWeek) % 7;

  // let daysSinceThisMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  // return today.add(daysUntilNextMonday + 7, 'day');
  // return today.add(14 + daysSinceThisMonday, 'day');
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  // console.log(`--- dayOfWeek=${dayOfWeek}, daysSinceMonday=${daysSinceMonday} `);

  const currentMonday = today.subtract(daysSinceMonday, 'day');
  const twoWeeksFromMonday = currentMonday.add(14, 'day');
  return twoWeeksFromMonday;
}

function getWeekBounds(date: dayjs.Dayjs): { monday: dayjs.Dayjs; sunday: dayjs.Dayjs } {
  // Calculate the difference to Monday (1 - day()) where Monday is 1 and Sunday is 0
  // const diffToMonday = date.day() === 0 ? -6 : 1 - date.day();
  const daysSinceMonday = (date.day() + 6) % 7;

  const monday = date.subtract(daysSinceMonday, 'day');

  // Sunday is always 6 days after Monday
  const sunday = monday.add(6, 'days');
  // console.log(`--- getWeekBounds:${monday.date()} - ${sunday.date()}`);

  return { monday, sunday };
}

function getThisMonday(): dayjs.Dayjs {
  const today = dayjs();
  const daysSinceMonday = (today.day() + 6) % 7;

  return today.subtract(daysSinceMonday, 'day').startOf('day');
}

export { getNextDayToSubmit, getWeekBounds, getThisMonday };
