import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useId
} from "react";

import * as customComponents from "../components/custom-components";
import { getDataAttributes } from "../helpers/getDataAttributes";
import { getDefaultClassNames } from "../helpers/getDefaultClassNames";
import { getFormatters } from "../helpers/getFormatters";
import { getStartEndMonths } from "../helpers/getStartEndMonths";
import * as defaultLabels from "../labels";
import type {
  ClassNames,
  CustomComponents,
  DataAttributes,
  DayPickerProps,
  Formatters,
  Labels,
  Mode
} from "../types";

const PropsContext = createContext<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PropsContextValue<any, any> | undefined
>(undefined);

/**
 * Holds the props passed to the DayPicker component, with some optional props
 * set to meaningful defaults.
 *
 * Access this context using the {@link usePropsContext} hook.
 *
 * @template ModeType - The selection mode.
 * @template IsRequired - Whether the selection is required.
 * @group Contexts
 */
export type PropsContextValue<
  ModeType extends Mode | undefined = undefined,
  IsRequired extends boolean = false
> = DayPickerProps<ModeType, IsRequired> & {
  /** The class names to add to the UI. */
  classNames: ClassNames;

  /** The unique ID of the DayPicker instance. */
  id: string;

  /** The data attributes to add to the calendar. */
  dataAttributes: DataAttributes;

  /** The components used in the UI. */
  components: CustomComponents;

  /** The formatters used in the UI. */
  formatters: Formatters;

  /** The labels used in the UI. */
  labels: Labels;

  /** The number of months displayed in the calendar. */
  numberOfMonths: number;

  /** The date of today. */
  today: Date;

  /** The month where the navigation starts. */
  startMonth: Date | undefined;
  /** The month where the navigation ends. */
  endMonth: Date | undefined;
};

function useProps<
  ModeType extends Mode | undefined = undefined,
  IsRequired extends boolean = false
>(initialProps: DayPickerProps<ModeType, IsRequired>) {
  const reactId = useId();

  const { startMonth, endMonth } = getStartEndMonths(initialProps);

  const propsContext: PropsContextValue<ModeType, IsRequired> = {
    ...initialProps,
    startMonth,
    endMonth,
    classNames: {
      ...getDefaultClassNames(),
      ...initialProps.classNames
    },
    components: {
      ...initialProps.components,
      ...customComponents
    },
    dataAttributes: getDataAttributes(initialProps),
    formatters: getFormatters(initialProps.formatters),
    id: initialProps.id ?? reactId,
    labels: {
      ...defaultLabels,
      ...initialProps.labels
    },
    numberOfMonths: initialProps.numberOfMonths ?? 1,
    today: initialProps.today ?? new Date()
  };

  return propsContext;
}

/**
 * Provide the shared props to the DayPicker components. Must be used as root of
 * the other providers.
 *
 * @private
 */
export function PropsContextProvider<
  ModeType extends Mode | undefined = undefined,
  IsRequired extends boolean = false
>({
  initialProps,
  children
}: PropsWithChildren<{
  initialProps: DayPickerProps<ModeType, IsRequired>;
}>) {
  const propsContextValue = useProps(initialProps);

  return (
    <PropsContext.Provider value={propsContextValue}>
      {children}
    </PropsContext.Provider>
  );
}

/**
 * Access to the props passed to `DayPicker`, with some meaningful defaults.
 *
 * Use this hook from the custom components passed via the `components` prop.
 *
 * @group Hooks
 * @see https://react-day-picker.js.org/advanced-guides/custom-components
 */
export function usePropsContext() {
  const propsContext = useContext(PropsContext);
  if (!propsContext) {
    throw new Error(
      "usePropsContext() must be used within a PropsContextProvider"
    );
  }
  return propsContext;
}
