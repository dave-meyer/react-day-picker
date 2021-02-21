import { ModifiersStatus } from './ModifiersStatus';

/**
 * Represent the event handler when multiple days are selected (empty array when
 * the no days are selected).
 */
export type SelectMultipleEventHandler = (
  /** The selected days */
  days: Date[],
  /** The day that was selected (or clicked) triggering the event. */
  selectedDay: Date,
  /** The day that was clicked */
  modifiers: ModifiersStatus,
  e: React.MouseEvent
) => void;
