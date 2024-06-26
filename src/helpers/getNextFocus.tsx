import { CalendarDay } from "../classes";
import type { PropsContextValue } from "../contexts";
import type { MoveFocusBy, MoveFocusDir } from "../types";
import { dateMatchModifiers } from "../utils/dateMatchModifiers";

import { getPossibleFocusDate } from "./getPossibleFocusDate";

export type Options = Pick<
  PropsContextValue,
  | "modifiers"
  | "locale"
  | "ISOWeek"
  | "weekStartsOn"
  | "startMonth"
  | "endMonth"
>;

export function getNextFocus(
  moveBy: MoveFocusBy,
  moveDir: MoveFocusDir,
  /** The date that is currently focused. */
  focused: CalendarDay,
  options: Pick<
    PropsContextValue,
    | "dateLib"
    | "disabled"
    | "hidden"
    | "modifiers"
    | "locale"
    | "ISOWeek"
    | "weekStartsOn"
    | "startMonth"
    | "endMonth"
  >,
  attempt: number = 0
): CalendarDay | undefined {
  if (attempt > 365) {
    // Limit the recursion to 365 attempts
    return undefined;
  }

  const possibleFocusDate = getPossibleFocusDate(
    moveBy,
    moveDir,
    focused.date,
    options
  );

  const isDisabled = Boolean(
    options.disabled &&
      dateMatchModifiers(possibleFocusDate, options.disabled, options.dateLib)
  );

  const isHidden = Boolean(
    options.hidden &&
      dateMatchModifiers(possibleFocusDate, options.hidden, options.dateLib)
  );

  const targetMonth = possibleFocusDate;
  const focusDay = new CalendarDay(
    possibleFocusDate,
    targetMonth,
    options.dateLib
  );
  if (!isDisabled && !isHidden) {
    return focusDay;
  }

  // Recursively attempt to find the next focusable date
  return getNextFocus(moveBy, moveDir, focusDay, options, attempt + 1);
}
