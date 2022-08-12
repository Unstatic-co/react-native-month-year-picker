import React, { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import moment from 'moment';
import invariant from 'invariant';

import RNMonthPickerView from './RNMonthPickerNativeComponent';
import {
  ACTION_DATE_SET,
  ACTION_DISMISSED,
  ACTION_NEUTRAL,
  NATIVE_FORMAT,
  DEFAULT_MODE,
} from './constants';

const { width } = Dimensions.get('screen');
const { Value, timing } = Animated;

const styles = StyleSheet.create({
  container: {
    width,
    position: 'absolute',
    zIndex: 500,
    bottom: 0,
  },
  pickerContainer: {
    height: 244,
    width,
  },
  picker: { flex: 1 },
});

const MonthPicker = forwardRef(({
  value,
  minimumDate,
  maximumDate,
  onChange: onAction,
  locale = '',
  mode = DEFAULT_MODE,
  okButton,
  cancelButton,
  neutralButton,
  autoTheme = true,
}, ref) => {
  invariant(value, 'value prop is required!');

  const [opacity] = useState(new Value(0));
  const [selectedDate, setSelectedDate] = useState(value);

  useImperativeHandle(ref, () => {
    return {
      selectedDate
    }
  })

  useEffect(() => {
    timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback(
    ({ nativeEvent: { newDate } }) =>
      setSelectedDate(moment(newDate, NATIVE_FORMAT).toDate()),
    [],
  );

  const onDone = useCallback(() => {
    onAction && onAction(ACTION_DATE_SET, selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const onCancel = useCallback(() => {
    onAction && onAction(ACTION_DISMISSED, undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNeutral = useCallback(() => {
    onAction && onAction(ACTION_NEUTRAL, selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
      <View style={styles.pickerContainer}>
        <RNMonthPickerView
          {...{
            locale,
            mode,
            onChange,
            onDone,
            onCancel,
            onNeutral,
            okButton,
            cancelButton,
            neutralButton,
            autoTheme,
          }}
          style={styles.picker}
          value={value.getTime()}
          minimumDate={minimumDate?.getTime() ?? null}
          maximumDate={maximumDate?.getTime() ?? null}
        />
      </View>
  );
});

export default MonthPicker;
