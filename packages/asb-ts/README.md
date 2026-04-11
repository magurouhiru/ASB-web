**Acknowledgments**  
This project is a web-based rewrite of the excellent desktop application [ARK Smart Breeding](https://github.com/cadon/ARKStatsExtractor) by cadon.

# asb-ts

このpackageは[ARK Smart Breeding](https://github.com/cadon/ARKStatsExtractor) の一部機能をTypescript で書き直したPackageです。

## 開発

### メモ

#### 計算式
公式wikiによると各ステータスの個体値は次の計算式で求められる。  
`V = (B × ( 1 + Lw × Iw × IwM) × TBHM × (1 + IB × 0.2 × IBM) + Ta × TaM) × (1 + TE × Tm × TmM) × (1 + Ld × Id × IdM)`

野生の生物の個体値は次の式で求められる。  
`Vw = B × ( 1 + Lw × Iw × IwM)`
- B: 基礎値。いきもの・ステータスによって異なる。
  - asbではvalues.json > species[n].fullStatsRaw[n][0]
- Lw: 野生のレベル。生まれたときの値＋テイムボーナスで上昇した値。
  - 入力が必要。
- Iw: 野生のレベルに対する増加率。いきもの・ステータスによって異なる。
  - asbではvalues.json > species[n].fullStatsRaw[n][1]
- IwM: 野生のレベルに対する調整値。サーバー・ステータスごとにグローバルな値。
  - asbではvalues/ServerMultipliers.csで管理。デフォルト1。

テイムされた生物の個体値は次の式で求められる。
`Vpt = (Vw × TBHM + Ta × TaM) × (1 + TE × Tm × TmM)`
- 下を参照。下のIB=0と同じではある。

ブリーディングされた生物の個体値は次の式で求められる。
`Vpt = (Vw × TBHM × (1 + IB × 0.2 × IBM) + Ta × TaM) × (1 + TE × Tm × TmM)`
- Vm: 野生の生物の個体値。上を参照。
- TBHM: テイムベースヘルス倍率(TamedBaseHealthMultiplier)。基本は1。たまに0.9とか。
  - asbではvalues.json > species[n].TamedBaseHealthMultiplier
- IB: 刷り込みボーナス。
  - 入力が必要。
- IBM: 刷り込みボーナスの調整値。サーバーごとにグローバルな値。
  - asbではvalues/ServerMultipliers.csで管理。デフォルト1。
- Ta: テイムボーナス(加算)。いきもの・ステータスによって異なる。テイム効果によらず固定。ティタノとかはマイナスになることも。
  - asbではvalues.json > species[n].fullStatsRaw[n][3]
- TaM: テイムボーナス(加算)の調整値。サーバー・ステータスごとにグローバルな値。
  - asbではvalues/ServerMultipliers.csで管理。デフォルト1。
- TE: テイム効果。いきもの・ステータスによって異なる。テイム効果によらず固定。
  - 入力が必要。
- Tm: テイムボーナス(乗算)。いきもの・ステータスによって異なる。テイム効果によらず固定。
  - asbではvalues.json > species[n].fullStatsRaw[n][4]
- TmM: テイムボーナス(乗算)の調整値。サーバー・ステータスごとにグローバルな値。
  - asbではvalues/ServerMultipliers.csで管理。デフォルト1。

ブリーディングされた生物の個体値は次の式で求められる。
`V = Vpt × (1 + Ld × Id × IdM)`
- Vpt: テイム(ブリーディング)された生物の個体値。上を参照。
- Ld: テイム後のレベル。プレイヤーが割り振ったやつ。
  - 入力が必要。
- Id: テイム後のレベルに対する増加率。いきもの・ステータスによって異なる。
  - asbではvalues.json > species[n].fullStatsRaw[n][2]
- IdM: テイム後のレベルに対する調整値。サーバー・ステータスごとにグローバルな値。
  - asbではvalues/ServerMultipliers.csで管理。デフォルト1。

**変異について公式では記載なし。**
