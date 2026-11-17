type Point = [bar: number, value: number];

type Marker = {
  bar: number;
  en: string;
  ru: string;
};

type Example = {
  closes: number[];
  guides?: { points: Point[]; color?: 'blue' | 'violet'; solid?: boolean }[];
  zones?: { bars: [number, number]; prices: [number, number] }[];
  lower?: { values: number[]; en: string; ru: string };
  wicks?: Record<number, [low: number, high: number]>;
  markers: [setup: Marker, signal: Marker];
};

// Prices and indicator values are schematic and use a 0–100 scale.
export const examples = {
  'adaptive-momentum-ribbon': {
    closes: [29, 34, 31, 39, 36, 43, 42, 48, 57, 65, 62, 71, 78, 85],
    guides: [
      {
        points: [
          [0, 49],
          [4, 48],
          [7, 51],
          [10, 61],
          [13, 71],
        ],
        color: 'blue',
      },
    ],
    lower: {
      values: [24, 29, 20, 31, 26, 36, 44, 48, 66, 79, 75, 83, 86, 92],
      en: 'Momentum oscillator',
      ru: 'Осциллятор импульса',
    },
    markers: [
      { bar: 5, en: 'Momentum starts to rise.', ru: 'Импульс начинает расти.' },
      {
        bar: 8,
        en: 'The Pine ribbon confirms a long signal.',
        ru: 'Лента Pine подтверждает сигнал на покупку.',
      },
    ],
  },
  'adaptive-trend-channel': {
    closes: [74, 66, 60, 64, 50, 45, 36, 31, 40, 55, 58, 63, 72, 81],
    guides: [
      {
        points: [
          [0, 84],
          [4, 67],
          [7, 53],
          [9, 48],
        ],
        color: 'violet',
      },
      {
        points: [
          [9, 31],
          [10, 36],
          [12, 50],
          [13, 60],
        ],
        color: 'blue',
        solid: true,
      },
    ],
    markers: [
      {
        bar: 7,
        en: 'The upper boundary follows the falling trend.',
        ru: 'Верхняя граница следует за нисходящим трендом.',
      },
      {
        bar: 10,
        en: 'The channel confirms an upward flip. The new lower boundary sets the stop.',
        ru: 'Канал подтверждает разворот вверх. Новая нижняя граница задаёт стоп.',
      },
    ],
  },
  breakout: {
    closes: [28, 37, 49, 46, 57, 50, 55, 49, 53, 58, 69, 65, 79, 76, 87],
    zones: [{ bars: [3, 9], prices: [46, 61] }],
    guides: [
      {
        points: [
          [3, 61],
          [13, 61],
        ],
      },
    ],
    markers: [
      {
        bar: 7,
        en: 'Price keeps returning below resistance.',
        ru: 'Цена несколько раз возвращается под сопротивление.',
      },
      {
        bar: 10,
        en: 'Price breaks above resistance. An entry also needs the required signals and score.',
        ru: 'Цена пробивает сопротивление. Для входа нужны обязательные сигналы и достаточный балл.',
      },
    ],
  },
  crab: {
    closes: [36, 44, 63, 78, 71, 56, 48, 60, 68, 54, 31, 10, 24, 39, 47],
    guides: [
      {
        points: [
          [0, 36],
          [3, 78],
          [6, 48],
          [8, 68],
          [11, 10],
        ],
        color: 'blue',
        solid: true,
      },
    ],
    markers: [
      {
        bar: 11,
        en: 'D extends below X to complete the bullish Crab shape.',
        ru: 'Точка D выходит ниже X и завершает бычий Crab.',
      },
      {
        bar: 13,
        en: 'Later candles confirm the D pivot. The signal uses that confirmation time.',
        ru: 'Следующие свечи подтверждают минимум D. Сигнал относится к моменту подтверждения.',
      },
    ],
  },
  'cup-and-handle': {
    closes: [73, 69, 53, 41, 31, 25, 26, 34, 48, 62, 72, 64, 59, 67, 79, 88],
    guides: [
      {
        points: [
          [0, 74],
          [15, 74],
        ],
      },
      {
        points: [
          [10, 72],
          [12, 59],
          [14, 79],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 12,
        en: 'The handle pulls back after price returns to the cup rim.',
        ru: 'Цена возвращается к краю чашки и откатывает, образуя ручку.',
      },
      {
        bar: 14,
        en: 'A close above the rim confirms the breakout in this example.',
        ru: 'В этом примере закрытие выше края чашки подтверждает пробой.',
      },
    ],
  },
  diamond: {
    closes: [33, 47, 61, 48, 80, 31, 71, 39, 62, 45, 55, 44, 34, 26, 19],
    guides: [
      {
        points: [
          [2, 62],
          [4, 82],
          [10, 56],
        ],
        color: 'blue',
      },
      {
        points: [
          [3, 47],
          [5, 29],
          [10, 48],
          [12, 55],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 10,
        en: 'The swings widen and then contract into a diamond.',
        ru: 'Размах колебаний сначала растёт, затем сужается и образует ромб.',
      },
      {
        bar: 12,
        en: 'The next close confirms a break below the rising boundary.',
        ru: 'Следующая свеча подтверждает пробой восходящей границы вниз.',
      },
    ],
  },
  'double-tap': {
    closes: [68, 58, 39, 24, 34, 48, 59, 50, 38, 25, 36, 55, 64, 72, 77],
    guides: [
      {
        points: [
          [3, 23],
          [9, 23],
        ],
        color: 'blue',
      },
      {
        points: [
          [6, 60],
          [14, 60],
        ],
      },
    ],
    markers: [
      {
        bar: 9,
        en: 'The second low forms near the first.',
        ru: 'Второй минимум формируется рядом с первым.',
      },
      {
        bar: 12,
        en: 'Price breaks above the high between the two lows.',
        ru: 'Цена пробивает максимум между двумя минимумами.',
      },
    ],
  },
  dragon: {
    closes: [78, 69, 52, 35, 20, 34, 57, 49, 37, 29, 40, 54, 62, 74, 83],
    guides: [
      {
        points: [
          [0, 80],
          [6, 58],
          [12, 36],
        ],
      },
      {
        points: [
          [4, 20],
          [9, 29],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 9,
        en: 'The rear foot forms above the first foot.',
        ru: 'Вторая лапа формируется выше первой.',
      },
      {
        bar: 11,
        en: 'Price closes above the descending line through the head and hump.',
        ru: 'Цена закрывается выше нисходящей линии через голову и горб.',
      },
    ],
  },
  flag: {
    closes: [87, 80, 67, 53, 39, 34, 44, 42, 52, 48, 57, 52, 38, 29, 21],
    guides: [
      {
        points: [
          [5, 42],
          [12, 63],
        ],
        color: 'blue',
      },
      {
        points: [
          [5, 31],
          [12, 52],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 10,
        en: 'After the drop, price consolidates between rising parallel lines.',
        ru: 'После падения цена корректируется между параллельными восходящими линиями.',
      },
      {
        bar: 12,
        en: 'Price breaks the lower flag boundary in the direction of the initial move.',
        ru: 'Цена пробивает нижнюю границу флага по направлению исходного движения.',
      },
    ],
  },
  gartley: {
    closes: [22, 48, 76, 87, 63, 46, 57, 68, 52, 38, 35, 42, 49, 61, 72],
    guides: [
      {
        points: [
          [0, 22],
          [3, 87],
          [5, 46],
          [7, 68],
          [10, 35],
        ],
        color: 'blue',
        solid: true,
      },
      {
        points: [
          [5, 46],
          [14, 46],
        ],
      },
    ],
    markers: [
      {
        bar: 10,
        en: 'D completes the retracement and stays above X.',
        ru: 'Точка D завершает коррекцию и остаётся выше X.',
      },
      {
        bar: 12,
        en: 'After D is confirmed, price breaks back above B.',
        ru: 'После подтверждения D цена пробивает уровень B вверх.',
      },
    ],
  },
  grid: {
    closes: [22, 30, 35, 49, 55, 63, 58, 49, 43, 52, 59, 68, 71, 84],
    guides: [
      {
        points: [
          [0, 22],
          [6, 45],
          [10, 52],
          [13, 66],
        ],
        color: 'blue',
        solid: true,
      },
      {
        points: [
          [7, 46],
          [12, 46],
        ],
      },
      {
        points: [
          [8, 36],
          [12, 36],
        ],
      },
    ],
    markers: [
      {
        bar: 8,
        en: 'Price pulls back while the uptrend filter stays active.',
        ru: 'Цена откатывает, пока фильтр показывает восходящий тренд.',
      },
      {
        bar: 10,
        en: 'The recovery triggers the first entry. The dashed levels illustrate possible additions.',
        ru: 'Возобновление роста даёт первый вход. Пунктир показывает возможные уровни добавления.',
      },
    ],
  },
  'grid-classic': {
    closes: [45, 65, 75, 57, 33, 29, 47, 66, 73, 53, 37, 19, 34, 45, 56],
    zones: [{ bars: [0, 14], prices: [27, 77] }],
    guides: [
      {
        points: [
          [0, 52],
          [14, 52],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 11,
        en: 'Price briefly breaks the lower edge of the range.',
        ru: 'Цена ненадолго выходит ниже нижней границы диапазона.',
      },
      {
        bar: 12,
        en: 'A close back inside is one of GridClassic’s entry setups.',
        ru: 'Закрытие обратно внутри диапазона даёт один из вариантов входа GridClassic.',
      },
    ],
  },
  'head-and-shoulders': {
    closes: [34, 42, 55, 69, 57, 47, 66, 88, 69, 45, 57, 66, 54, 42, 34, 22],
    guides: [
      {
        points: [
          [5, 47],
          [9, 45],
          [15, 42],
        ],
      },
    ],
    markers: [
      {
        bar: 11,
        en: 'The right shoulder forms below the head. The neckline connects the two lows.',
        ru: 'Правое плечо ниже головы. Линия шеи соединяет два минимума.',
      },
      {
        bar: 14,
        en: 'The confirming candle closes below the neckline.',
        ru: 'Подтверждающая свеча закрывается ниже линии шеи.',
      },
    ],
  },
  'hyperliquid-consensus': {
    closes: [43, 46, 44, 49, 44, 48, 52, 50, 47, 52, 55, 53, 59, 64],
    lower: {
      values: [14, 17, 12, 21, 26, 35, 39, 38, 52, 68, 91, 85, 78, 70],
      en: 'Long share of tracked entry volume',
      ru: 'Доля покупок в объёме входов отслеживаемых счетов',
    },
    markers: [
      {
        bar: 6,
        en: 'Tracked accounts build long exposure.',
        ru: 'На отслеживаемых счетах растёт доля покупок.',
      },
      {
        bar: 10,
        en: 'Long entries meet the consensus threshold if coverage and volume checks pass.',
        ru: 'Покупки достигают порога согласия, если проверки охвата и объёма пройдены.',
      },
    ],
  },
  'imbalance-momentum': {
    closes: [28, 32, 30, 36, 41, 65, 70, 68, 75, 81, 77, 84, 89],
    wicks: { 4: [33, 42], 6: [61, 74] },
    zones: [{ bars: [4, 12], prices: [42, 61] }],
    markers: [
      {
        bar: 5,
        en: 'A strong move leaves a gap between the wicks of the first and third four-hour candles.',
        ru: 'После резкого движения между тенями первой и третьей четырёхчасовых свечей остаётся разрыв.',
      },
      {
        bar: 6,
        en: 'The third four-hour candle closes and confirms the bullish gap.',
        ru: 'Третья четырёхчасовая свеча закрывается и подтверждает бычий разрыв.',
      },
    ],
  },
  'liquidity-tails': {
    closes: [59, 66, 52, 46, 57, 64, 70, 58, 50, 55, 65, 73, 68, 80],
    wicks: { 3: [25, 56], 8: [32, 60] },
    zones: [{ bars: [3, 10], prices: [25, 44] }],
    markers: [
      {
        bar: 3,
        en: 'A long lower wick identifies the zone.',
        ru: 'Длинная нижняя тень выделяет зону.',
      },
      {
        bar: 8,
        en: 'Price touches the zone again and is rejected upward.',
        ru: 'Цена снова касается зоны и отскакивает вверх.',
      },
    ],
  },
  'liquidity-zones': {
    closes: [67, 75, 61, 51, 46, 57, 65, 51, 45, 54, 70, 65, 74, 82, 87],
    zones: [{ bars: [4, 12], prices: [41, 50] }],
    markers: [
      {
        bar: 4,
        en: 'A confirmed swing low defines a support zone.',
        ru: 'Подтверждённый минимум задаёт зону поддержки.',
      },
      {
        bar: 9,
        en: 'Price revisits the zone and closes above it.',
        ru: 'Цена возвращается в зону и закрывается выше неё.',
      },
    ],
  },
  'london-breakout': {
    closes: [58, 61, 67, 62, 56, 51, 55, 62, 57, 43, 39, 31, 26, 22],
    zones: [{ bars: [0, 8], prices: [47, 71] }],
    guides: [
      {
        points: [
          [0, 47],
          [13, 47],
        ],
      },
    ],
    markers: [
      {
        bar: 8,
        en: 'At 08:00 UTC, the previous nine hourly candles define the range.',
        ru: 'В 08:00 UTC диапазон задают предыдущие девять часовых свечей.',
      },
      {
        bar: 11,
        en: 'An hourly candle closes below the buffered range during the entry window.',
        ru: 'В часы входа свеча закрывается ниже границы диапазона с заданным отступом.',
      },
    ],
  },
  'ma-strategy': {
    closes: [73, 65, 61, 48, 43, 36, 35, 42, 49, 55, 67, 72, 69, 79],
    guides: [
      {
        points: [
          [0, 75],
          [3, 57],
          [6, 38],
          [8, 43],
          [10, 58],
          [13, 74],
        ],
        color: 'blue',
        solid: true,
      },
      {
        points: [
          [0, 68],
          [3, 63],
          [6, 52],
          [8, 48],
          [10, 51],
          [13, 60],
        ],
        solid: true,
      },
    ],
    markers: [
      {
        bar: 6,
        en: 'The fast moving average is still below the slow one.',
        ru: 'Быстрая средняя пока ниже медленной.',
      },
      {
        bar: 9,
        en: 'The fast average crosses above the slow average.',
        ru: 'Быстрая средняя пересекает медленную снизу вверх.',
      },
    ],
  },
  'market-flush-reversal': {
    closes: [72, 76, 69, 65, 61, 57, 51, 45, 23, 33, 48, 53, 50, 64, 73],
    wicks: { 8: [10, 47] },
    lower: {
      values: [18, 14, 19, 23, 22, 26, 33, 44, 100, 79, 56, 31, 25, 20, 17],
      en: 'Liquidation activity',
      ru: 'Активность ликвидаций',
    },
    markers: [
      {
        bar: 8,
        en: 'Price drops sharply as liquidation activity spikes.',
        ru: 'Цена резко падает на всплеске ликвидаций.',
      },
      {
        bar: 10,
        en: 'Closed candles confirm a reversal in this example.',
        ru: 'В этом примере закрытые свечи подтверждают разворот.',
      },
    ],
  },
  'range-reclaim': {
    closes: [54, 61, 67, 61, 53, 51, 58, 49, 38, 34, 49, 55, 63, 58, 68],
    zones: [{ bars: [0, 14], prices: [45, 72] }],
    markers: [
      {
        bar: 8,
        en: 'Price trades below the low of a closed higher-timeframe candle.',
        ru: 'Цена уходит ниже минимума закрытой свечи старшего интервала.',
      },
      {
        bar: 10,
        en: 'A candle closes strictly back inside that range.',
        ru: 'Свеча закрывается внутри диапазона, выше его нижней границы.',
      },
    ],
  },
  'relative-rotation': {
    closes: [38, 43, 37, 43, 46, 46, 53, 57, 56, 62, 67, 75, 73, 81],
    guides: [
      {
        points: [
          [0, 38],
          [3, 43],
          [5, 45],
          [8, 48],
          [11, 50],
          [13, 52],
        ],
        color: 'blue',
        solid: true,
      },
    ],
    markers: [
      {
        bar: 5,
        en: 'The instrument starts pulling away from BTC, shown as the blue line.',
        ru: 'Инструмент начинает опережать BTC, показанный синей линией.',
      },
      {
        bar: 10,
        en: 'Relative strength and market filters can confirm a long entry.',
        ru: 'Относительная сила и рыночные фильтры могут подтвердить покупку.',
      },
    ],
  },
  'reverse-trendline': {
    closes: [55, 71, 60, 48, 63, 53, 41, 54, 46, 36, 45, 33, 27, 19],
    wicks: { 1: [50, 75], 4: [46, 67], 7: [38, 59], 10: [33, 51] },
    guides: [
      {
        points: [
          [1, 75],
          [10, 51],
          [13, 43],
        ],
      },
    ],
    markers: [
      {
        bar: 7,
        en: 'Successive highs define descending resistance.',
        ru: 'Последовательные максимумы задают нисходящее сопротивление.',
      },
      {
        bar: 11,
        en: 'Price tests the line and turns down from it.',
        ru: 'Цена касается линии и разворачивается вниз.',
      },
    ],
  },
  'structure-zones': {
    closes: [38, 48, 65, 70, 52, 44, 53, 67, 69, 56, 64, 78, 83, 78, 90],
    zones: [{ bars: [3, 14], prices: [66, 74] }],
    markers: [
      {
        bar: 8,
        en: 'Several reactions form a resistance zone.',
        ru: 'Несколько отбоев формируют зону сопротивления.',
      },
      {
        bar: 11,
        en: 'Price closes above the zone, illustrating a breakout entry.',
        ru: 'Цена закрывается выше зоны. Это пример входа на пробое.',
      },
    ],
  },
  'trading-patterns': {
    closes: [25, 39, 56, 73, 64, 69, 59, 64, 53, 57, 61, 73, 77, 69, 84],
    guides: [
      {
        points: [
          [3, 77],
          [11, 61],
        ],
        color: 'blue',
      },
      {
        points: [
          [4, 59],
          [11, 45],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 8,
        en: 'Enabled detectors watch the same candles. In this example, Flag finds a setup.',
        ru: 'Включённые детекторы смотрят одни и те же свечи. Здесь фигуру находит Flag.',
      },
      {
        bar: 11,
        en: 'The wrapper selects one entry if several detectors signal on this bar.',
        ru: 'Если на этой свече сработают несколько детекторов, стратегия выберет один вход.',
      },
    ],
  },
  'trend-follow': {
    closes: [24, 35, 33, 46, 53, 49, 62, 58, 70, 69, 78, 75, 85, 89],
    guides: [
      {
        points: [
          [0, 17],
          [3, 24],
          [5, 33],
          [8, 45],
          [10, 56],
          [13, 68],
        ],
        color: 'violet',
        solid: true,
      },
    ],
    markers: [
      {
        bar: 4,
        en: 'Higher highs and lows form an upward trend.',
        ru: 'Максимумы и минимумы растут, формируя восходящий тренд.',
      },
      {
        bar: 7,
        en: 'The engine confirms the trend. The violet line shows the trailing stop.',
        ru: 'Стратегия подтверждает тренд. Фиолетовая линия показывает скользящий стоп.',
      },
    ],
  },
  'trend-pullback': {
    closes: [31, 40, 56, 65, 74, 80, 70, 63, 57, 62, 72, 75, 88, 84],
    guides: [
      {
        points: [
          [0, 28],
          [4, 41],
          [8, 52],
          [13, 65],
        ],
        color: 'blue',
        solid: true,
      },
      {
        points: [
          [0, 20],
          [4, 29],
          [8, 41],
          [13, 51],
        ],
        solid: true,
      },
    ],
    lower: {
      values: [49, 56, 63, 72, 75, 83, 58, 44, 30, 35, 53, 59, 67, 61],
      en: 'RSI',
      ru: 'RSI',
    },
    markers: [
      {
        bar: 8,
        en: 'RSI falls during a pullback within the uptrend.',
        ru: 'RSI снижается на откате внутри восходящего тренда.',
      },
      {
        bar: 10,
        en: 'A later candle closes above the previous candle’s high.',
        ru: 'Одна из следующих свечей закрывается выше максимума предыдущей.',
      },
    ],
  },
  'trend-shift': {
    closes: [79, 70, 76, 61, 53, 44, 29, 27, 33, 29, 42, 59, 63, 72, 79],
    guides: [
      {
        points: [
          [0, 89],
          [4, 70],
          [7, 52],
          [10, 49],
          [11, 38],
          [14, 57],
        ],
        color: 'violet',
        solid: true,
      },
    ],
    markers: [
      {
        bar: 9,
        en: 'Price is still below the adaptive trend band.',
        ru: 'Цена пока остаётся ниже адаптивной полосы тренда.',
      },
      {
        bar: 11,
        en: 'The engine signals an upward shift. The stop goes beyond the active band.',
        ru: 'Стратегия отмечает смену тренда вверх. Стоп ставится за текущей полосой.',
      },
    ],
  },
  trendline: {
    closes: [78, 70, 61, 68, 55, 60, 47, 55, 44, 48, 57, 62, 73, 82],
    wicks: { 0: [72, 82], 3: [58, 72], 5: [52, 66], 7: [45, 59], 9: [42, 53] },
    guides: [
      {
        points: [
          [0, 82],
          [9, 53],
          [13, 40],
        ],
      },
    ],
    markers: [
      {
        bar: 9,
        en: 'Lower highs define a falling resistance line.',
        ru: 'Снижающиеся максимумы задают линию сопротивления.',
      },
      {
        bar: 10,
        en: 'Price breaks through the line and closes above it.',
        ru: 'Цена пробивает линию и закрывается выше неё.',
      },
    ],
  },
  triangle: {
    closes: [47, 72, 36, 70, 43, 73, 50, 69, 57, 70, 63, 72, 83, 87],
    guides: [
      {
        points: [
          [1, 76],
          [13, 76],
        ],
      },
      {
        points: [
          [2, 33],
          [11, 65],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 10,
        en: 'Rising lows approach a horizontal resistance level.',
        ru: 'Растущие минимумы приближаются к горизонтальному сопротивлению.',
      },
      {
        bar: 12,
        en: 'Price breaks the horizontal boundary of the ascending triangle.',
        ru: 'Цена пробивает горизонтальную границу восходящего треугольника.',
      },
    ],
  },
  'value-area-reclaim': {
    closes: [54, 61, 55, 63, 69, 74, 82, 76, 66, 60, 55, 50, 56, 53],
    zones: [{ bars: [0, 13], prices: [46, 72] }],
    guides: [
      {
        points: [
          [0, 59],
          [13, 59],
        ],
      },
    ],
    markers: [
      {
        bar: 6,
        en: 'Price leaves the zone that contains most trading volume.',
        ru: 'Цена выходит из зоны, в которой прошла основная часть объёма.',
      },
      {
        bar: 8,
        en: 'Price closes back inside. The dashed line marks the highest-volume price.',
        ru: 'Цена закрывается обратно внутри зоны. Пунктир отмечает цену с наибольшим объёмом.',
      },
    ],
  },
  'volatility-compression-breakout': {
    closes: [35, 56, 41, 55, 44, 54, 47, 51, 49, 52, 51, 63, 74, 69, 85],
    guides: [
      {
        points: [
          [0, 68],
          [4, 61],
          [8, 55],
          [10, 55],
          [14, 79],
        ],
        color: 'blue',
      },
      {
        points: [
          [0, 25],
          [4, 37],
          [8, 45],
          [10, 46],
          [14, 48],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 8,
        en: 'Price swings shrink as the Bollinger Bands tighten.',
        ru: 'Колебания цены уменьшаются, полосы Боллинджера сужаются.',
      },
      {
        bar: 11,
        en: 'Price leaves the range as volatility expands again.',
        ru: 'Цена выходит из диапазона, когда волатильность снова растёт.',
      },
    ],
  },
  'volume-divergence': {
    closes: [65, 57, 45, 34, 43, 57, 50, 38, 27, 34, 44, 47, 58, 62],
    guides: [
      {
        points: [
          [3, 31],
          [8, 24],
        ],
        color: 'violet',
      },
    ],
    lower: {
      values: [76, 60, 50, 22, 48, 63, 55, 50, 37, 49, 57, 60, 69, 75],
      en: 'Normalized volume',
      ru: 'Нормированный объём',
    },
    markers: [
      {
        bar: 8,
        en: 'The second price low is lower, while the volume low is higher.',
        ru: 'Второй минимум цены ниже первого, а минимум объёма выше.',
      },
      {
        bar: 10,
        en: 'The later candles confirm the pivot and the bullish divergence.',
        ru: 'Следующие свечи подтверждают минимум и бычью дивергенцию.',
      },
    ],
  },
  'vwap-reversion': {
    closes: [61, 57, 63, 55, 58, 49, 40, 31, 24, 31, 44, 48, 54, 57, 60],
    guides: [
      {
        points: [
          [0, 61],
          [5, 59],
          [10, 55],
          [14, 55],
        ],
        solid: true,
      },
      {
        points: [
          [0, 76],
          [5, 75],
          [10, 72],
          [14, 73],
        ],
        color: 'blue',
      },
      {
        points: [
          [0, 45],
          [5, 43],
          [10, 38],
          [14, 37],
        ],
        color: 'blue',
      },
    ],
    markers: [
      {
        bar: 8,
        en: 'A candle closes below the lower VWAP band.',
        ru: 'Свеча закрывается ниже нижней полосы VWAP.',
      },
      {
        bar: 10,
        en: 'Price closes inside the bands and below VWAP. The VWAP at confirmation sets the target.',
        ru: 'Цена закрывается внутри полос и ниже VWAP. Цель задаёт VWAP в момент подтверждения.',
      },
    ],
  },
} satisfies Record<string, Example>;

export type StrategyExample = Example;
export type StrategySlug = keyof typeof examples;
