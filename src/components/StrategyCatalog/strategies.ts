type Strategy = {
  name: string;
  slug: string;
  en: string;
  ru: string;
};

export const strategies: Strategy[] = [
  {
    name: 'HeadAndShoulders',
    slug: 'head-and-shoulders',
    en: 'Enters on a break of the neckline of a head and shoulders pattern.',
    ru: 'Ищет пробой линии шеи фигуры «голова и плечи».',
  },
  {
    name: 'Breakout',
    slug: 'breakout',
    en: 'Scores several conditions to check for an upward or downward breakout.',
    ru: 'Оценивает несколько условий, чтобы подтвердить пробой вверх или вниз.',
  },
  {
    name: 'Triangle',
    slug: 'triangle',
    en: 'Waits for a candle to close outside a triangle pattern.',
    ru: 'Ждёт, когда свеча закроется за границей треугольника.',
  },
  {
    name: 'AdaptiveMomentumRibbon',
    slug: 'adaptive-momentum-ribbon',
    en: 'Checks momentum and the Keltner channel for a change in direction.',
    ru: 'Проверяет силу движения и канал Кельтнера, чтобы найти смену направления.',
  },
  {
    name: 'AdaptiveTrendChannel',
    slug: 'adaptive-trend-channel',
    en: 'Looks for direction changes in a channel that adjusts to price.',
    ru: 'Ищет смену направления в канале, который меняется вслед за ценой.',
  },
  {
    name: 'Crab',
    slug: 'crab',
    en: 'Looks for a reversal after five price extremes form an XABCD pattern.',
    ru: 'Ищет разворот после того, как пять крайних точек цены образуют фигуру XABCD.',
  },
  {
    name: 'CupAndHandle',
    slug: 'cup-and-handle',
    en: 'Looks for a breakout from a cup and handle or its inverse.',
    ru: 'Ищет пробой обычной или перевёрнутой «чашки с ручкой».',
  },
  {
    name: 'Diamond',
    slug: 'diamond',
    en: 'Looks for a reversal when a widening range narrows and price breaks out.',
    ru: 'Ищет разворот, когда диапазон сначала расширяется, затем сужается и цена выходит из него.',
  },
  {
    name: 'DoubleTap',
    slug: 'double-tap',
    en: 'Looks for a break after a double top or double bottom.',
    ru: 'Ждёт пробоя после двойной вершины или двойного дна.',
  },
  {
    name: 'Dragon',
    slug: 'dragon',
    en: 'Looks for a reversal from four price extremes and confirms it with a line break.',
    ru: 'Ищет разворот по четырём крайним точкам цены и подтверждает его пробоем линии.',
  },
  {
    name: 'Flag',
    slug: 'flag',
    en: 'Looks for a move that resumes after a brief pullback.',
    ru: 'Ищет продолжение сильного движения после короткого отката.',
  },
  {
    name: 'Gartley',
    slug: 'gartley',
    en: 'Checks Fibonacci ratios in a five-point pattern and waits for a break of point B.',
    ru: 'Проверяет пропорции Фибоначчи в фигуре из пяти точек и ждёт пробоя точки B.',
  },
  {
    name: 'Grid',
    slug: 'grid',
    en: 'Enters on a pullback or retest and adds to the position within a shared risk limit.',
    ru: 'Входит на откате или повторном тесте уровня и добавляет объём в пределах общего риска.',
  },
  {
    name: 'GridClassic',
    slug: 'grid-classic',
    en: 'Looks for a return to the middle of a range or a move beyond it.',
    ru: 'Ищет возврат к середине диапазона или движение за его границы.',
  },
  {
    name: 'HyperliquidConsensus',
    slug: 'hyperliquid-consensus',
    en: 'Uses position data from selected Hyperliquid accounts to determine direction.',
    ru: 'Определяет направление по позициям выбранных счетов Hyperliquid.',
  },
  {
    name: 'ImbalanceMomentum',
    slug: 'imbalance-momentum',
    en: 'Looks for a directional gap across three consecutive four-hour candles.',
    ru: 'Ищет ценовой разрыв между первой и третьей из трёх четырёхчасовых свечей.',
  },
  {
    name: 'LiquidityTails',
    slug: 'liquidity-tails',
    en: 'Checks how price reacts when it revisits an area left by long candle wicks.',
    ru: 'Проверяет реакцию цены при возврате в зону длинных теней свечей.',
  },
  {
    name: 'LiquidityZones',
    slug: 'liquidity-zones',
    en: 'Checks price reactions near zones drawn from recent highs and lows.',
    ru: 'Ищет реакцию цены у зон, построенных по недавним максимумам и минимумам.',
  },
  {
    name: 'LondonBreakout',
    slug: 'london-breakout',
    en: 'Waits for an hourly candle to close beyond an earlier session range.',
    ru: 'Ждёт закрытия часовой свечи за границей предыдущего диапазона.',
  },
  {
    name: 'MaStrategy',
    slug: 'ma-strategy',
    en: 'Enters when two moving averages cross.',
    ru: 'Входит при пересечении двух скользящих средних.',
  },
  {
    name: 'MarketFlushReversal',
    slug: 'market-flush-reversal',
    en: 'Looks for a reversal after pressure across the market.',
    ru: 'Ищет разворот после резкого движения на широком рынке.',
  },
  {
    name: 'RangeReclaim',
    slug: 'range-reclaim',
    en: 'Enters when price moves back into a range from a completed higher interval.',
    ru: 'Ищет возврат в диапазон закрытого старшего интервала.',
  },
  {
    name: 'RelativeRotation',
    slug: 'relative-rotation',
    en: 'Compares the strength of a symbol with Bitcoin.',
    ru: 'Сравнивает силу движения инструмента и биткоина.',
  },
  {
    name: 'ReverseTrendLine',
    slug: 'reverse-trendline',
    en: 'Looks for a bounce or reversal near a support or resistance line.',
    ru: 'Ищет отбой или разворот у линии поддержки или сопротивления.',
  },
  {
    name: 'StructureZones',
    slug: 'structure-zones',
    en: 'Looks for a bounce or break at a price zone.',
    ru: 'Ищет отбой или пробой у ценовой зоны.',
  },
  {
    name: 'TradingPatterns',
    slug: 'trading-patterns',
    en: 'Checks for four chart patterns in a single strategy.',
    ru: 'Проверяет четыре графические фигуры в одной стратегии.',
  },
  {
    name: 'TrendFollow',
    slug: 'trend-follow',
    en: 'Follows an existing trend and moves the stop as price advances.',
    ru: 'Следует за трендом и подтягивает стоп вслед за ценой.',
  },
  {
    name: 'TrendPullback',
    slug: 'trend-pullback',
    en: 'Waits for an RSI pullback and a candle that confirms the hourly trend.',
    ru: 'Ждёт отката по RSI и свечу, которая подтверждает часовой тренд.',
  },
  {
    name: 'TrendShift',
    slug: 'trend-shift',
    en: 'Looks for a change in direction when the trend band flips.',
    ru: 'Ищет смену направления после разворота границы тренда.',
  },
  {
    name: 'TrendLine',
    slug: 'trendline',
    en: 'Looks for a break through a line drawn from recent highs or lows.',
    ru: 'Ищет пробой линии через недавние максимумы или минимумы.',
  },
  {
    name: 'ValueAreaReclaim',
    slug: 'value-area-reclaim',
    en: 'Looks for price to return to the main traded volume range after a failed break.',
    ru: 'Ищет возврат в зону основного объёма торгов после ложного пробоя.',
  },
  {
    name: 'VolatilityCompressionBreakout',
    slug: 'volatility-compression-breakout',
    en: 'Looks for a price break after a period of narrow moves.',
    ru: 'Ищет пробой после периода небольших колебаний цены.',
  },
  {
    name: 'VolumeDivergence',
    slug: 'volume-divergence',
    en: 'Looks for a reversal when volume stops confirming price extremes.',
    ru: 'Ищет разворот, когда объём перестаёт подтверждать крайние точки цены.',
  },
  {
    name: 'VwapReversion',
    slug: 'vwap-reversion',
    en: 'Looks for a confirmed return toward the session’s volume-weighted average price.',
    ru: 'Ищет подтверждённый возврат к средней цене сессии, взвешенной по объёму.',
  },
];
