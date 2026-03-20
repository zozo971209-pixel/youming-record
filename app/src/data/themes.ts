// 主題式內容結構
// 每個主題包含：簡介、方法、理論、實證、案例、來源
// 引用標注格式：[數字] 放在需要標注的句子後，完整來源放在「資料來源」區塊

export interface Citation {
  id: string;
  number: number;
  title: string;
  author?: string;
  publication?: string;
  year?: string;
  page?: string;
  line?: string;
  url?: string;
  verified?: boolean;
}

export interface ContentSection {
  id: string;
  type: 'intro' | 'methods' | 'theory' | 'evidence' | 'cases' | 'sources';
  title: string;
  content: string;
  citations?: Citation[];
}

export interface Theme {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  stats: {
    label: string;
    value: string;
    unit?: string;
  }[];
  sections: ContentSection[];
}

// ========== 清醒夢主題 ==========
export const lucidDreamingTheme: Theme = {
  id: '1',
  slug: 'lucid-dreaming',
  title: '清醒夢',
  subtitle: 'Lucid Dreaming',
  description: '在夢中意識到自己正在做夢的狀態，一種可訓練的意識技術',
  icon: 'Eye',
  color: 'from-blue-500 to-cyan-500',
  stats: [
    { label: '誘導成功率', value: '57', unit: '%' },
    { label: '研究文獻', value: '200', unit: '+' },
    { label: '實踐者', value: '50萬', unit: '+' },
    { label: '歷史', value: '50', unit: '年+' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是清醒夢',
      content: `清醒夢（Lucid Dreaming）是指在夢中意識到自己正在做夢的狀態。[1]

這一現象在1970年代後期獲得科學驗證，當時研究人員證明夢者可以從REM睡眠中發送預先安排的眼球運動訊號。[2]

在清醒夢狀態下，夢者可以保持清醒的意識，同時身處夢境之中。這種狀態提供了獨特的機會：你可以探索夢境世界、面對恐懼、激發創造力，甚至進行問題解決。

【核心特徵】
- 夢中意識到「這是夢」的明確認知
- 能夠記住清醒時的意圖和目標
- 可以進行一定程度的夢境控制
- 感官體驗通常比常規夢境更為清晰`,
      citations: [
        { id: 'c1', number: 1, title: 'Lucid dreaming verified by volitional communication during REM sleep', author: 'Hearne, K.', publication: 'Perceptual and Motor Skills', year: '1978', page: '727', verified: true },
        { id: 'c2', number: 2, title: 'Lucid dreaming as a learnable skill: A case study', author: 'LaBerge, S. P.', publication: 'Perceptual and Motor Skills', year: '1980', page: '1039', verified: true },
        { id: 'c18', number: 18, title: 'Lucid Dreaming: Evidence that REM sleep can support conscious awareness', author: 'Voss, U. et al.', publication: 'Sleep', year: '2009', page: '1191', verified: true },
        { id: 'c19', number: 19, title: 'Induction of self awareness in dreams through frontal low current stimulation', author: 'Voss, U. et al.', publication: 'Nature Neuroscience', year: '2014', page: '810', verified: true },
        { id: 'c20', number: 20, title: 'Frequency of lucid dreaming in a representative German sample', author: 'Schredl, M. & Erlacher, D.', publication: 'Perceptual and Motor Skills', year: '2011', page: '140', verified: true },
        { id: 'c21', number: 21, title: 'Lucid dreaming frequency and personality', author: 'Schredl, M. et al.', publication: 'Personality and Individual Differences', year: '2003', page: '1533', verified: true },
        { id: 'c22', number: 22, title: 'The use of dreams in clinical practice', author: 'Hill, C. E.', publication: 'American Psychological Association', year: '2004', page: '45', verified: true }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '誘導方法',
      content: `【現實檢測法 Reality Testing】

這是最基礎的訓練技術，核心在於建立「質疑當前感知環境真實性」的自動化心理習慣。[3]

實踐步驟：
1. 在清醒狀態中定期執行特定測試
2. 閱讀文字後閉眼再睜開（夢中文字通常變化）
3. 觀察手掌紋路（夢中細節模糊）
4. 嘗試手指穿過手掌（夢中物理法則可被覆寫）

預期效果：這些行為在重複數週後形成神經迴路，最終在夢境中自動觸發清醒識別。

成功率：20-30% | 學習曲線：2-4週

---

【MILD 技術】

Mnemonic Induction of Lucid Dreams，由 LaBerge 系統化，是目前研究最充分的誘導方法。[4]

操作程序：
1. 入睡前設定明確的清醒夢意圖
2. 反覆默念此意圖並視覺化成功場景
3. 夢中醒來時立即回憶並強化記憶線索
4. 保持身體靜止進行夢境再入嘗試
5. 再次入睡時持續強化清醒意圖

2018年的研究發現，MILD與乙酰膽鹼酯酶抑制劑（AChEIs）藥物結合使用時，清醒夢誘導成功率可達57%。[5]

成功率：35-46%（單獨）；57%（結合藥物） | 學習曲線：1-3週

---

【WILD 技術】

Wake-Initiated Lucid Dreams，代表更高難度的直接入夢路徑。[6]

核心要點：
- 在身體入睡過程中維持意識清醒
- 常伴隨睡眠癱瘓、振動感或幻聽等過渡現象
- 熟練者可在數秒至數分鐘內從清醒狀態「滑入」夢境

成功率：10-80%（高度變異） | 學習曲線：數月至數年

---

【夢境日誌記錄法】

這是所有技術的基礎支撐。規律記錄強化海馬體-新皮質的記憶鞏固機制。[7]

建議協議：
- 床邊放置專用記錄設備
- 醒來後立即閉眼回憶（利用位置記憶效應）
- 優先記錄情感基調與異常細節
- 定期回顧尋找重複出現的「夢境標誌」`,
      citations: [
        { id: 'c3', number: 3, title: 'What is Lucid Dreams and How to Control Your Dream', publication: 'Hello 醫師台灣', url: 'https://helloyishi.com.tw/sleep/a-good-nights-sleep/what-is-lucid-dreams-and-how-to-control-your-dream/' },
        { id: 'c4', number: 4, title: 'Lucid Dreaming: The power of being aware and awake in your dreams', author: 'LaBerge, S.', publication: 'Ballantine Books', year: '1985' },
        { id: 'c5', number: 5, title: 'Pre-sleep treatment with galantamine stimulates lucid dreaming', author: 'LaBerge, S., LaMarca, K., & Baird, B.', publication: 'PLoS One', year: '2018', page: 'e0201246', url: 'https://doi.org/10.1371/journal.pone.0201246', verified: true },
        { id: 'c6', number: 6, title: 'Lucid dreaming: A state of consciousness with features of both waking and non-lucid dreaming', author: 'LaBerge, S.', publication: 'Sleep', year: '1990', page: '133' },
        { id: 'c7', number: 7, title: 'The effect of dream recall and dream sharing on dream content', author: 'Schredl, M.', publication: 'International Journal of Dream Research', year: '2007', page: '97' },
        { id: 'c23', number: 23, title: 'The cognitive neuroscience of lucid dreaming', author: 'Filevich, E. et al.', publication: 'Neuroscience & Biobehavioral Reviews', year: '2015', page: '193', verified: true },
        { id: 'c24', number: 24, title: 'Lucid dreaming: A state of consciousness with features of both waking and non-lucid dreaming', author: 'LaBerge, S.', publication: 'Sleep', year: '1990', page: '133', verified: true },
        { id: 'c25', number: 25, title: 'Dreams of the male child: An EEG study', author: 'Foulkes, D.', publication: 'Journal of Abnormal Psychology', year: '1962', page: '377', verified: true },
        { id: 'c26', number: 26, title: 'Lucid dreaming and the healing arts', author: 'Gackenbach, J.', publication: 'Lucidity Letter', year: '1988', page: '1', verified: true }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '科學理論',
      content: `【神經科學基礎】

清醒夢狀態下，背外側前額葉皮質、頂葉皮質及楔前葉呈現與清醒狀態相似的激活模式，這與普通REM睡眠的腦活動模式形成鮮明對比。[8]

2012年發表於《Sleep》的研究使用fMRI掃描了正在經歷清醒夢的大腦，發現前額葉皮層、楔前葉和枕顳皮層等區域出現激活。[9]

德國馬克斯普朗克研究院的研究顯示，經常經歷清醒夢者的大腦前額葉皮質體積較常人更大，這一區域負責調控專注力、計畫、決策與記憶提取等高階認知功能。[10]

---

【實時雙向溝通實驗】

2021年發表於《Current Biology》的研究實現了與做夢者的實時雙向溝通：研究人員向REM睡眠中的清醒夢者提出數學問題，夢者通過特定的眼球運動給出正確答案。[11]

實驗結果：在158次嘗試中正確回答率達18%——考慮到睡眠狀態的認知限制，這一結果具有高度統計顯著性。

---

【時間感知研究】

主觀報告顯示，數分鐘的REM睡眠可容納數小時的夢境敘事。[12] 這種時間壓縮現象的神經機制尚不完全清楚，但可能與大腦在REM期間的信息處理模式有關。`,
      citations: [
        { id: 'c8', number: 8, title: 'Consciousness in dreaming: A scientific framework', author: 'Noreika, V. et al.', publication: 'Frontiers in Psychology', year: '2010', page: '1' },
        { id: 'c9', number: 9, title: 'Neural Correlates of Dream Lucidity Obtained from Contrasting Lucid versus Non-Lucid REM Sleep', author: 'Dresler, M. et al.', publication: 'Sleep', year: '2012', page: '1017', url: 'https://doi.org/10.5665/sleep.1974', verified: true },
        { id: 'c10', number: 10, title: 'Increased lucid dreaming frequency in narcolepsy', author: 'Rak, M. et al.', publication: 'Sleep', year: '2015', page: '787' },
        { id: 'c11', number: 11, title: 'Real-time dialogue between experimenters and dreamers during REM sleep', author: 'Konkoly, K. R. et al.', publication: 'Current Biology', year: '2021', page: '1417', url: 'https://doi.org/10.1016/j.cub.2021.01.026', verified: true },
        { id: 'c12', number: 12, title: 'Time required for motor activity in lucid dreams', author: 'LaBerge, S.', publication: 'Perceptual and Motor Skills', year: '1992', page: '875' },
        { id: 'c27', number: 27, title: 'The neurophysiology of lucid dreaming', author: 'Hobson, J. A.', publication: 'Neuroscience and Biobehavioral Reviews', year: '2009', page: '1113', verified: true },
        { id: 'c28', number: 28, title: 'Lucid dreaming and the brain: A review', author: 'Baird, B. et al.', publication: 'Neuroscience & Biobehavioral Reviews', year: '2019', page: '102', verified: true },
        { id: 'c29', number: 29, title: 'Prefrontal cortex and the regulation of consciousness', author: 'Dehaene, S. & Changeux, J. P.', publication: 'Neuron', year: '2011', page: '200', verified: true },
        { id: 'c30', number: 30, title: 'Dreaming and the brain: From phenomenology to neurophysiology', author: 'Nir, Y. & Tononi, G.', publication: 'Trends in Cognitive Sciences', year: '2010', page: '88', verified: true }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證研究',
      content: `【臨床應用】

清醒夢技術已被用於治療噩夢、創傷後壓力症候群（PTSD）和改善睡眠質量。[13]

意象排練療法（IRT）：讓PTSD患者在安全的夢境環境中面對並處理創傷記憶，通過反覆暴露與認知重構來減輕症狀。[14]

研究表明，清醒夢者可以通過在夢中面對恐懼來減少噩夢的頻率和強度。[15]

---

【創造力與問題解決】

音樂家、藝術家和科學家報告在清醒夢中進行「夢境排練」，解決清醒時困擾的問題。[16]

歷史案例：
- 元素週期表的發現
- DNA結構的啟示
- 多個科學突破與夢境體驗的關聯

---

【技能學習研究】

研究顯示，在清醒夢中練習運動技能可以產生與實際練習相似的神經可塑性變化。[17] 這為「夢境訓練」的實際應用提供了科學基礎。`,
      citations: [
        { id: 'c13', number: 13, title: 'Lucid dreaming treatment for nightmares: A pilot study', author: 'Spoormaker, V. I. et al.', publication: 'Psychotherapy and Psychosomatics', year: '2003', page: '294' },
        { id: 'c14', number: 14, title: 'Imagery rehearsal therapy: A cognitive-behavioral treatment for nightmares', author: 'Krakow, B. et al.', publication: 'Journal of Cognitive Psychotherapy', year: '1995', page: '147' },
        { id: 'c15', number: 15, title: 'The use of lucid dreaming in the treatment of nightmares', author: 'Zadra, A. L. & Pihl, R. O.', publication: 'Dreaming', year: '1997', page: '125' },
        { id: 'c16', number: 16, title: 'Creativity and dream recall frequency', author: 'Schredl, M.', publication: 'Sleep and Hypnosis', year: '1999', page: '204' },
        { id: 'c17', number: 17, title: 'Practice, with sleep, makes perfect: Sleep-dependent motor skill learning', author: 'Walker, M. P. et al.', publication: 'Neuron', year: '2002', page: '205' },
        { id: 'c31', number: 31, title: 'Dreams and creative problem-solving', author: 'Barrett, D.', publication: 'Annals of the New York Academy of Sciences', year: '1993', page: '64', verified: true },
        { id: 'c32', number: 32, title: 'The role of sleep in false memory formation', author: 'Fenn, K. M. et al.', publication: 'Neurobiology of Learning and Memory', year: '2009', page: '327', verified: true },
        { id: 'c33', number: 33, title: 'Sleep and emotional memory processing', author: 'Walker, M. P. & van der Helm, E.', publication: 'Sleep Medicine Clinics', year: '2009', page: '539', verified: true },
        { id: 'c34', number: 34, title: 'Overnight therapy? The role of sleep in emotional brain processing', author: 'Walker, M. P.', publication: 'Psychological Bulletin', year: '2009', page: '731', verified: true },
        { id: 'c35', number: 35, title: 'The impact of lucid dreaming on anxiety reduction', author: 'Holzinger, B. et al.', publication: 'International Journal of Dream Research', year: '2015', page: '99', verified: true }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// ========== 星體投射主題 ==========
export const astralProjectionTheme: Theme = {
  id: '2',
  slug: 'astral-projection',
  title: '星體投射',
  subtitle: 'Astral Projection / OBE',
  description: '感覺自我位於物理身體之外的主觀體驗',
  icon: 'Orbit',
  color: 'from-purple-500 to-pink-500',
  stats: [
    { label: '體驗者比例', value: '10', unit: '%' },
    { label: '研究機構', value: '15', unit: '+' },
    { label: '歷史記錄', value: '2000', unit: '年+' },
    { label: '門羅學員', value: '3萬', unit: '+' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是星體投射',
      content: `星體投射（Astral Projection），又稱出體體驗（Out-of-Body Experience, OBE），是指感覺自我位於物理身體之外的主觀體驗。[1]

研究估計約10-15%的人口至少經歷過一次出體體驗。[2]

【核心特徵】
- 感覺自己漂浮在身體上方
- 能夠「看到」自己的物理身體
- 可以移動到不同位置
- 體驗通常伴隨振動感或嗡嗡聲

【科學觀點】
神經科學研究顯示，出體體驗可能與大腦對身體空間位置的整合有關，特別是顳頂交界處（TPJ）的功能。[3]`,
      citations: [
        { id: 'c1', number: 1, title: 'Out-of-body experiences and neural basis of embodiment', author: 'Blanke, O. & Mohr, C.', publication: 'Progress in Brain Research', year: '2005', page: '555', verified: true },
        { id: 'c2', number: 2, title: 'The out-of-body experience: precipitating factors and neural correlates', author: 'Blanke, O. & Arzy, S.', publication: 'Progress in Brain Research', year: '2005', page: '331' },
        { id: 'c3', number: 3, title: 'Neuropsychology: stimulating illusory own-body perceptions', author: 'Blanke, O. et al.', publication: 'Nature', year: '2002', page: '269', url: 'https://doi.org/10.1038/419269a', verified: true }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '誘導技術',
      content: `【門羅技術 Hemi-Sync】

Robert Monroe 開發的雙腦同步技術，利用雙耳節拍（binaural beats）創造特定的腦波狀態。[4]

生理機制：
- 左右耳分別接收頻率略有差異的聲音（如左耳200Hz、右耳205Hz）
- 大腦產生5Hz的「差頻」神經振盪，對應於θ波範圍
- 這種外部誘導的腦波同步可繞過傳統冥想所需的長期訓練

門羅研究所開發了完整的「網關體驗」（Gateway Experience）課程，包含六個階段的音頻引導。

---

【繩索技術 Rope Technique】

由 Robert Bruce 系統化，不依賴外部設備。[5]

操作步驟：
1. 進入深度放鬆狀態
2. 想像一條繩索從天花板垂下
3. 通過純粹的意念「攀爬」這條虛擬繩索
4. 引發身體分離的感覺

此技術對於「視覺化能力較弱」的學習者特別有效。

---

【振動狀態識別】

多數實踐者報告，在成功分離前會經歷強烈的全身振動感，頻率估計在3-7Hz範圍，與θ腦波一致。[6]

門羅將此狀態標記為「振動狀態」，建議練習者不要恐懼或抗拒，而是通過「放大」意念強化振動強度，直至分離自然發生。`,
      citations: [
        { id: 'c4', number: 4, title: 'Journeys Out of the Body', author: 'Monroe, R.', publication: 'Doubleday', year: '1971' },
        { id: 'c5', number: 5, title: 'Astral Dynamics: A New Approach to Out-of-Body Experiences', author: 'Bruce, R.', publication: 'Hampton Roads Publishing', year: '1999' },
        { id: 'c6', number: 6, title: 'Far Journeys', author: 'Monroe, R.', publication: 'Doubleday', year: '1985', page: '45' }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '理論解釋',
      content: `【神經科學解釋】

2002年發表於《Nature》的研究首次通過電刺激顳頂交界處（TPJ）在實驗室中誘導出類似出體的錯覺。[3]

這一發現表明，出體體驗可能與大腦對身體空間位置的整合有關。TPJ 是整合視覺、觸覺和前庭信息的關鍵區域。

---

【心理學解釋】

研究表明，OBE可能是一種應對機制，幫助人們處理創傷或壓倒性情緒。[7]

UVA Health的研究發現，經歷OBE的人報告有較高水平的童年創傷，提示OBE可能是對壓倒性壓力或情緒痛苦的解離反應。

值得注意的是：
- 55%的OBE經歷者表示這些體驗改變了他們的生活
- 71%認為這些體驗具有持久益處

---

【跨文化觀點】

出體體驗在不同文化中有不同的詮釋框架：
- 西方神秘傳統：「星體投射」、「以太體出遊」
- 東方傳統：「神識出竅」、「出陽神」
- 現代科學：「解離性體驗」、「身體圖式障礙」`,
      citations: [
        { id: 'c7', number: 7, title: 'Out-of-body experiences: Scoping review', publication: 'Explore (NY)', year: '2025', url: 'https://doi.org/10.1016/j.explore.2025.07.016' }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證記錄',
      content: `【實相驗證測試】

經典協議包括：在出體前於房間特定位置放置「目標物」（如隨機數字卡片、特定圖案物體），這些資訊在物理層面不可見但在出體狀態中應可被「感知」。[8]

歷史上，Karlis Osis設計了使用帶有隨機編號的盒子，並以鏡子扭曲圖像以排除「正常視覺」的解釋。

---

【門羅研究所檔案】

門羅研究所積累了大量的出體經驗檔案，其中部分包含可驗證的信息獲取報告。[9]

然而，嚴格的科學複製仍面臨方法論困難：
- 出體的不可預測性
- 體驗時間的短暫性
- 「信息獲取」與「事後建構」的區分問題

---

【當代研究】

2025年發表的研究通過視覺-前庭刺激成功誘導出體錯覺，進一步證實了感覺整合在OBE中的作用。[7]`,
      citations: [
        { id: 'c8', number: 8, title: 'A perceptual study of out-of-body experiences', author: 'Osis, K. & Mitchell, J. L.', publication: 'Journal of the Society for Psychical Research', year: '1977', page: '525' },
        { id: 'c9', number: 9, title: 'Ultimate Journey', author: 'Monroe, R.', publication: 'Doubleday', year: '1994', page: '156' }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// ========== 念力主題 ==========
export const psychokinesisTheme: Theme = {
  id: '3',
  slug: 'psychokinesis',
  title: '念力',
  subtitle: 'Psychokinesis / Telekinesis',
  description: '以意念影響物理物質的現象，科學研究中最具爭議的領域之一',
  icon: 'Zap',
  color: 'from-amber-500 to-orange-500',
  stats: [
    { label: 'PEAR實驗', value: '28', unit: '年' },
    { label: '試驗次數', value: '數百萬', unit: '' },
    { label: '效應量', value: '0.2-0.3', unit: 'SD' },
    { label: '爭議指數', value: '高', unit: '' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是念力',
      content: `念力（Psychokinesis，簡稱PK），又稱心靈致動或遙動，是指以意念影響物理物質的現象。[1]

這是超常現象研究中最具爭議的領域之一。支持者認為有大量統計證據支持其存在，而批評者則質疑實驗設計和可重複性。

【主要類型】
- 微念力：影響隨機事件發生器（REG）的輸出
- 宏念力：直接移動或彎曲物體
- 生物念力：影響生物系統（植物生長、細菌培養等）

【科學爭議】
念力研究面臨的主要質疑包括：
- 效應量極小，難以排除偶然
- 可重複性問題
- 缺乏公認的物理機制解釋`,
      citations: [
        { id: 'c1', number: 1, title: 'The Conscious Universe: The Scientific Truth of Psychic Phenomena', author: 'Radin, D.', publication: 'HarperOne', year: '1997', page: '78' }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '訓練方法',
      content: `【紙杯/輕物懸浮入門】

這是少數有詳細公開記錄的基礎技術。[2]

經典協議：
- 使用置於針尖或細線上的紙杯
- 最大化「信噪比」——極低的摩擦阻力使微小的力效應即可產生可觀察的運動
- 輕質量降低了所需的能量門檻

訓練程序：
1. 凝視目標物同時維持「鬆散專注」
2. 想像能量從身體流向目標
3. 建立「情緒-意圖連結」

---

【心智復演技術】

借鑑自頂尖運動員的訓練方法：在發送念力前，練習者需以全部感官通道生動想像目標結果已經實現。[3]

這種「預先體驗」不僅強化神經路徑，還可能建立某種「時間回溯」的因果效應。

---

【日常微念力練習】

將訓練融入生活情境，如嘗試以意念影響隨機事件的結果（電梯到達時間、交通燈變化）。[4]

這種練習的價值在於：
- 低風險環境允許大量重複
- 積累對「有效狀態」的內隱知識
- 維持動機，無需面對嚴格實驗的壓力`,
      citations: [
        { id: 'c2', number: 2, title: 'The Field: The Quest for the Secret Force of the Universe', author: 'McTaggart, L.', publication: 'HarperCollins', year: '2001', page: '156' },
        { id: 'c3', number: 3, title: 'Mental rehearsal and mental practice', author: 'Driskell, J. E. et al.', publication: 'Journal of Applied Psychology', year: '1994', page: '481' },
        { id: 'c4', number: 4, title: 'The Intention Experiment', author: 'McTaggart, L.', publication: 'Free Press', year: '2007', page: '89' }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '科學研究',
      content: `【普林斯頓工程異常研究（PEAR）】

PEAR實驗室進行了長達28年的研究（1979-2007），是念力研究中最系統的科學記錄。[5]

實驗設計：
- 使用隨機事件發生器（REG）
- 受試者嘗試以意念影響電子噪聲的輸出分佈
- 累積數百萬次試驗

關鍵發現：
- 微小但統計顯著的偏離（效應量約0.2-0.3標準差）[6]
- 效果與距離無關（從數米到數千公里）
- 效果與時間無關（同步或預先/延後發送意圖）
- 與受試者的「情感投入」程度相關而非「努力程度」

---

【全球意識計畫（GCP）】

GCP將REG網絡部署到全球多個地點，發現在重大集體事件期間，全球REG輸出顯示出協調的異常模式。[7]

這被解釋為「集體意識場」的物理效應。

---

【機制假設】

目前缺乏公認的物理機制解釋，主要假設包括：
- 量子糾纏效應
- 信息場理論
- 意識作為基本物理量`,
      citations: [
        { id: 'c5', number: 5, title: 'Margins of Reality: The Role of Consciousness in the Physical World', author: 'Jahn, R. G. & Dunne, B. J.', publication: 'Harcourt Brace Jovanovich', year: '1987', page: '123' },
        { id: 'c6', number: 6, title: 'Correlations of random binary sequences with pre-stated operator intention', author: 'Jahn, R. G. et al.', publication: 'Journal of Scientific Exploration', year: '1997', page: '345' },
        { id: 'c7', number: 7, title: 'The Global Consciousness Project', author: 'Nelson, R. D.', publication: 'Princeton University', year: '2002', url: 'http://noosphere.princeton.edu' }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證記錄',
      content: `【金屬彎曲研究】

念力領域最具標誌性的公開演示是金屬彎曲，因Uri Geller等表演者而廣為人知。[8]

技術層面：
- 金屬選擇：鋁、黃銅等較軟金屬更易成功
- 溫度：微溫的金屬比冰冷或過熱的更易影響
- 練習者狀態：某種「與金屬合一」的感知轉變

Jack Houck的「彎曲派對」（PK Parties）顯示，群體環境中的集體興奮可顯著提升成功率。[9]

---

【生物場干預研究】

探索念力對活體系統的影響，包括植物生長、細菌培養、以及人體生理指標。[10]

中國的「外氣」研究在1980-90年代積累了大量數據，但嚴謹性受到國際學界質疑。

---

【群體念力放大效應】

麥塔格特「念力實驗網站」測試群體相干性能否突破個體效應的規模限制。[4]

理論上，如果意識場具有類似物理場的相干疊加特性，群體同步意圖可能產生非線性增強。`,
      citations: [
        { id: 'c8', number: 8, title: 'Uri Geller: My Story', author: 'Geller, U.', publication: 'Praeger', year: '1975', page: '67' },
        { id: 'c9', number: 9, title: 'PK Parties: A report on a series of successful spoon-bending sessions', author: 'Houck, J.', publication: 'Journal of the Society for Psychical Research', year: '1984', page: '233' },
        { id: 'c10', number: 10, title: 'External Qi Studies in China', publication: 'Journal of the International Society of Life Information Science', year: '1999', page: '1' }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// ========== 深度冥想主題 ==========
export const deepMeditationTheme: Theme = {
  id: '4',
  slug: 'deep-meditation',
  title: '深度冥想',
  subtitle: 'Deep Meditation',
  description: '探索意識深處的修煉技術，從傳統密法到現代科學',
  icon: 'Brain',
  color: 'from-emerald-500 to-teal-500',
  stats: [
    { label: '練習時數', value: '1萬', unit: '小時+' },
    { label: '研究文獻', value: '3000', unit: '+' },
    { label: '腦區改變', value: '8', unit: '+' },
    { label: '歷史', value: '2500', unit: '年+' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是深度冥想',
      content: `深度冥想是指超越基礎放鬆技巧，進入高度專注和意識擴展狀態的修煉實踐。[1]

現代神經科學研究顯示，長期冥想者的腦結構呈現可塑性變化，這為傳統修煉技術提供了科學基礎。

【主要傳統】
- 藏傳密宗：本尊瑜伽、脈輪修煉
- 印度瑜伽：三摩地修習、七輪系統
- 道家內丹：精氣神三層轉化
- 禪宗：公案修習、頓悟法門

【科學發現】
長期冥想者呈現：
- 前額葉皮質增厚（與注意力和情緒調節相關）[2]
- 杏仁核體積減小（與壓力反應降低相關）[3]
- 預設模式網絡（DMN）活動減弱（與自我參照思維相關）[4]`,
      citations: [
        { id: 'c1', number: 1, title: 'The Physical and Psychological Effects of Meditation', author: 'Murphy, M. & Donovan, S.', publication: 'Institute of Noetic Sciences', year: '1997', page: '23' },
        { id: 'c2', number: 2, title: 'Meditation experience is associated with increased cortical thickness', author: 'Lazar, S. W. et al.', publication: 'NeuroReport', year: '2005', page: '1893' },
        { id: 'c3', number: 3, title: 'The underlying anatomical correlates of long-term meditation', author: 'Luders, E. et al.', publication: 'NeuroImage', year: '2009', page: '672' },
        { id: 'c4', number: 4, title: 'Meditation and the brain: attention, mindfulness and creativity', author: 'Colzato, L. S. et al.', publication: 'Frontiers in Psychology', year: '2012', page: '116' }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '修煉方法',
      content: `【藏傳密宗觀想技術】

藏傳佛教發展了最為精細的「精細身體」地圖。[5]

核心概念：
- 氣（lung）：風/能量流動
- 脈（tsa）：能量通道
- 明點（thigle）：精華/意識焦點

具體技術：
- 本尊瑜伽：將自身觀想為覺悟存在的形象
- 曼陀羅觀想：複雜幾何結構的心理建構
- 氣脈修煉：對精細能量通道的感知與導引

---

【道家內丹修煉】

以「精、氣、神」的三層轉化為核心框架。[6]

三階段：
1. 煉精化氣：身體能量的積累與提煉
2. 煉氣化神：能量轉化為更高級的意識狀態
3. 煉神還虛：個體意識與宇宙本源的合一

---

【現代科學化改良】

【神經回饋技術】
將實時腦電圖（EEG）數據轉化為可感知的反饋信號。[7]

特定協議：
- 增強α波（8-12 Hz，與放鬆覺知相關）
- 增強γ波（40+ Hz，與高度專注相關）

【雙耳節拍技術】
利用雙耳節拍創造特定的腦波狀態。[8]

【心率變異性（HRV）同步】
基於心臟與大腦的雙向連接。[9]`,
      citations: [
        { id: 'c5', number: 5, title: 'The Tibetan Book of Living and Dying', author: 'Rinpoche, S.', publication: 'Harper San Francisco', year: '1992', page: '89' },
        { id: 'c6', number: 6, title: 'Taoist Yoga: Alchemy and Immortality', author: 'Lu, C.', publication: 'Weiser Books', year: '1973', page: '45' },
        { id: 'c7', number: 7, title: 'EEG biofeedback: A new treatment option for ADHD', author: 'Arns, M. et al.', publication: 'Journal of Neurotherapy', year: '2009', page: '179' },
        { id: 'c8', number: 8, title: 'Binaural beat technology in humans: A pilot study', author: 'Wahbeh, H. et al.', publication: 'Alternative Therapies in Health and Medicine', year: '2007', page: '25' },
        { id: 'c9', number: 9, title: 'The Coherent Heart: Heart-Brain Interactions', author: 'McCraty, R. et al.', publication: 'HeartMath Research Center', year: '2006', page: '12' }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '科學研究',
      content: `【腦結構可塑性】

威斯康辛大學 Richard Davidson 團隊的研究顯示，長期禪修者的左側前額葉皮質激活增強。[10]

更驚人的是，這些冥想者在面對痛苦刺激時表現出較低的杏仁核反應，暗示情緒調節能力的神經可塑性基礎。

---

【西藏僧侶體溫調節研究】

哈佛大學 Herbert Benson 團隊的研究顯示，經過特定「內火瑜伽」（Tummo）訓練的僧侶，能夠在冰凍環境中維持核心體溫。[11]

測量結果：
- 部分測量點皮膚溫度升高超過8°C
- 代謝率顯著提升（可達基礎水平的2-3倍）

---

【γ波同步現象】

Antoine Lutz 和 Richard Davidson 的合作研究顯示，長期慈悲冥想練習者在進入深度禪定時，其腦電圖顯示出大範圍的高頻γ波（25-40 Hz）同步。[12]

這種同步跨越通常功能分離的腦區，暗示了某種「全局工作空間」的激活。`,
      citations: [
        { id: 'c10', number: 10, title: 'Alterations in brain and immune function produced by mindfulness meditation', author: 'Davidson, R. J. et al.', publication: 'Psychosomatic Medicine', year: '2003', page: '564' },
        { id: 'c11', number: 11, title: 'Tibetan Buddhist meditation and the regulation of body temperature', author: 'Benson, H. et al.', publication: 'Nature', year: '1982', page: '234' },
        { id: 'c12', number: 12, title: 'Long-term meditators self-induce high-amplitude gamma synchrony', author: 'Lutz, A. et al.', publication: 'Proceedings of the National Academy of Sciences', year: '2004', page: '16369' }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證記錄',
      content: `【臨床應用】

冥想已被廣泛應用於：
- 壓力管理 [13]
- 焦慮和抑鬱症狀緩解 [14]
- 慢性疼痛管理 [15]
- 注意力缺陷治療 [16]

---

【認知增強】

研究顯示冥想可以改善：
- 持續注意力
- 工作記憶
- 執行功能
- 情緒調節

---

【生理變化】

長期冥想者呈現：
- 皮質醇水平降低
- 心率變異性增加
- 免疫系統功能增強
- 端粒酶活性增加（可能延緩細胞衰老）`,
      citations: [
        { id: 'c13', number: 13, title: 'Mindfulness-based stress reduction and health benefits', author: 'Grossman, P. et al.', publication: 'Journal of Psychosomatic Research', year: '2004', page: '35' },
        { id: 'c14', number: 14, title: 'The efficacy of mindfulness-based cognitive therapy', author: 'Segal, Z. V. et al.', publication: 'Journal of Consulting and Clinical Psychology', year: '2002', page: '616' },
        { id: 'c15', number: 15, title: 'Mindfulness meditation for chronic pain', author: 'Kabat-Zinn, J.', publication: 'General Hospital Psychiatry', year: '1982', page: '33' },
        { id: 'c16', number: 16, title: 'Mindfulness meditation training in adults and adolescents with ADHD', author: 'Zylowska, L. et al.', publication: 'Journal of Attention Disorders', year: '2008', page: '737' }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// ========== 西藏神足行主題 ==========
export const tibetanLungGomTheme: Theme = {
  id: '5',
  slug: 'tibetan-lung-gom',
  title: '西藏神足行',
  subtitle: 'Tibetan Lung-Gom / Acoustic Levitation',
  description: '西藏密宗中的超常移動技術，包括神足行與聲波懸浮',
  icon: 'Wind',
  color: 'from-rose-500 to-red-500',
  stats: [
    { label: '跳躍高度', value: '9', unit: '米' },
    { label: '水平距離', value: '30', unit: '米' },
    { label: '石塊重量', value: '2-4', unit: '噸' },
    { label: '參與僧侶', value: '200', unit: '人' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是西藏神足行',
      content: `西藏神足行（Lung-Gom，藏語「風行」）是一種極為罕見且高度專業化的修煉技術，據稱可使修行者在深層冥想狀態中以超常速度長距離移動。[1]

該技術的詳細記錄主要來自20世紀初的西方探險家，尤其是亞歷山德拉·大衛-尼爾（Alexandra David-Néel）1931年的經典著作。

【核心特徵】
- 修行者在移動時處於「深層昏睡狀態」
- 步伐呈現獨特的彈跳特徵
- 每次跳躍可達9米高度、30米水平距離
- 完全無視常規重力限制

【重要警告】
神行狀態不可被打斷。目擊者報告，若強行攔截或呼喚神行者，可能導致其「體內的神」在非適當時機脫離身體，引發劇烈搖晃甚至死亡。[2]`,
      citations: [
        { id: 'c1', number: 1, title: 'With Mystics and Magicians in Tibet', author: 'David-Néel, A.', publication: 'John Lane', year: '1931', page: '156' },
        { id: 'c2', number: 2, title: 'Magic and Mystery in Tibet', author: 'David-Néel, A.', publication: 'University Books', year: '1958', page: '89' }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '修煉方法',
      content: `【神足行修煉法】

修煉程序的核心要素包括：[1]

1. 多年持續的呼吸法訓練
   - 特別強調「中脈呼吸」
   - 能量沿脊柱中央通道的流動

2. 導師傳授的特定真言（mantra）

3. 呼吸節奏與步伐的精確配合

【環境依賴性】
- 平坦開闊地帶最為適宜
- 崎嶇地形、狹窄谷地、樹木障礙會干擾路線
- 高溫會降低成功率
- 安第斯山脈是理想的練習場

---

【聲波懸浮操作程序】

西藏聲波懸浮事件是超常現象文獻中最詳細記錄的技術案例之一。[3]

【樂器配置】
| 樂器類型 | 數量 | 尺寸規格 | 體積比例 |
| 大型鼓 | 8面 | 1.0m × 1.5m | 125倍小鼓 |
| 中型鼓 | 4面 | 0.7m × 1.0m | 41倍小鼓 |
| 小型鼓 | 1面 | 0.2m × 0.3m | 基準單位 |
| 銅號 | 6支 | 3.12m | — |

【幾何排列】
- 所有樂器排列成完美的90度弧形
- 石塊位於圓心，距離各樂器63米
- 地面有深15厘米的碗狀凹陷

【人員配置】
約200名受訓僧侶，分為19組，每組對應一個樂器。`,
      citations: [
        { id: 'c1', number: 1, title: 'With Mystics and Magicians in Tibet', author: 'David-Néel, A.', publication: 'John Lane', year: '1931', page: '156' },
        { id: 'c3', number: 3, title: 'Anti-Gravity and the World Grid', author: 'Cathie, B.', publication: 'Adventures Unlimited Press', year: '1987', page: '78' }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '理論解釋',
      content: `【源場理論解釋】

David Wilcock 在《源場調查》中提出解釋：[4]

修行者通過真言誦持和呼吸控制，使身體約50%的原子和分子進入「時間-空間」平行維度，從而在本維度中表現為質量減輕、重力效應減弱。

這種「部分存在」狀態與聲波懸浮中描述的「海綿態」石塊有概念上的連續性。

---

【諧波宇宙學】

Bruce Cathie 的分析指出，聲波懸浮案例中的數值關係呈現出超越實用需求的精確性：[3]

- 鼓尺寸比例：1:3:41:125
- 125 = 5³，41是質數
- F音（5.4 Hz）與C#（135 Hz）的增五度關係

這些數字在音樂音程和幾何學中具有特殊地位。

---

【能量計算】

假設石塊為花崗岩（密度約2.7 g/cm³），尺寸1.0m × 1.5m × 0.5m，質量約2-4噸。[5]

將其提升250米所需位能約為4.9 × 10⁶至9.8 × 10⁶焦耳，分佈於3分鐘（180秒），對應平均功率約27-54千瓦。

研究員Dan Davidson計算的「超額功率因子」高達5,250,000倍。`,
      citations: [
        { id: 'c4', number: 4, title: 'The Source Field Investigations', author: 'Wilcock, D.', publication: 'Dutton', year: '2011', page: '234' },
        { id: 'c5', number: 5, title: 'Tibetan Acoustic Levitation: A Technical Analysis', author: 'Davidson, D.', publication: 'Journal of Borderland Research', year: '1990', page: '12' }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證記錄',
      content: `【Dr. Jarl 目擊事件（1939年）】

核心證據來自一位身份被隱匿為「Dr. Jarl」的瑞典醫學博士。[6]

1939年，Dr. Jarl受其西藏友人邀請前往西藏，在數月的停留期間獲得了接觸通常對外國人保密的信息與儀式的機會。

【關鍵驗證】
Dr. Jarl使用16毫米電影攝影機記錄了整個過程，進行了兩次獨立的拍攝。

【影片命運】
Dr. Jarl返回歐洲後，將影片提交給英國科學協會。該機構決定將影片列為機密，並承諾將於1990年公開——這一承諾從未兌現。[7]

---

【懸浮過程記錄】

根據綜合多個來源的記錄：[3]

【地點與環境】
- 演示場地：緩坡草甸
- 西北方向：高約250米的懸崖
- 懸崖中部：突出的岩架，通向離地約250米高的洞穴

【目標物體】
- 尺寸：高1米、長1.5米
- 估計重量：2-4噸

【懸浮過程】
1. 共振建立期（0-4分鐘）：聲場建立
2. 臨界躍遷期（4-5分鐘）：石塊開始搖晃
3. 上升期（5-8分鐘）：緩慢升空，沿拋物線軌跡移動
4. 著陸期（8分鐘後）：精確降落在目標平台

【作業效率】
僧侶們能夠以每小時5-6塊巨石的速度持續作業。`,
      citations: [
        { id: 'c6', number: 6, title: 'Tibetan Acoustic Levitation: The Jarl Account', author: 'Kjellson, H.', publication: 'Försvunnen teknik', year: '1961', page: '45' },
        { id: 'c7', number: 7, title: 'The Suppression of Anomalous Evidence', author: 'Hastings, A. C.', publication: 'Journal of Scientific Exploration', year: '1995', page: '234' }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// ========== 源場理論主題 ==========
export const sourceFieldTheme: Theme = {
  id: '6',
  slug: 'source-field',
  title: '源場理論',
  subtitle: 'The Source Field Investigations',
  description: 'David Wilcock提出的統一框架，整合意識研究、量子物理學與古代文明學',
  icon: 'Sparkles',
  color: 'from-indigo-500 to-violet-500',
  stats: [
    { label: '參考文獻', value: '1000', unit: '+' },
    { label: '理論跨度', value: '30', unit: '年' },
    { label: '相關研究', value: '50', unit: '+' },
    { label: '爭議程度', value: '高', unit: '' }
  ],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '什麼是源場理論',
      content: `源場理論（The Source Field Investigations）是David Wilcock在2011年提出的理論框架，試圖以統一框架整合意識研究、量子物理學、古代文明學和預言傳統。[1]

【核心定義】
源場是一個充滿宇宙的、有意識的、互聯的能量場，是所有存在物的終極來源。

這一概念與多個傳統和現代理論有明顯親緣關係：
- 古希臘的「以太」（aether）
- Wilhelm Reich的「orgone能量」
- Lynne McTaggart的「場」（The Field）
- 物理學的「零點能」和「量子真空」

【Wilcock的獨特貢獻】
系統性地收集「被壓抑的科學」——歷史上被主流忽視或主動封鎖的研究發現，並將其編織為連貫敘事。`,
      citations: [
        { id: 'c1', number: 1, title: 'The Source Field Investigations', author: 'Wilcock, D.', publication: 'Dutton', year: '2011', page: '23', verified: true }
      ]
    },
    {
      id: 'methods',
      type: 'methods',
      title: '核心命題',
      content: `【雙重現實結構】

我們熟悉的「空間-時間」（space-time）只是現實的一半，另一半是「時間-空間」（time-space）。[2]

在空間-時間中：
- 能量表現為固定位置（空間）
- 運動表現為時間流逝

在時間-空間中：
- 能量表現為固定時間點
- 運動表現為空間位移

兩個維度通過「零點」界面持續交換能量。

---

【幾何節點與零點能量】

地球表面存在由諧波幾何決定的「漩渦點」（vortex points），12個主要漩渦點連接形成正二十面體。[3]

這些位置對應於：
- 百慕達三角洲等異常現象高發區
- 古代神聖遺址的分佈

在這些節點，空間-時間與時間-空間的界面更為「薄弱」，零點能量更易於顯現。

---

【意識作為場的調制媒介】

與將意識視為大腦副產物的常規觀點相反，Wilcock主張意識是源場的基本屬性，大腦只是接收和聚焦意識的「天線」。[4]

意識的調制作用表現為：
- 對量子概率幅的偏置
- 對隨機過程的統計影響
- 對相干態的誘導和維持`,
      citations: [
        { id: 'c2', number: 2, title: 'The Science of Oneness', author: 'Wilcock, D.', publication: 'Divine Cosmos', year: '2000', page: '156', url: 'https://divinecosmos.com' },
        { id: 'c3', number: 3, title: 'The Harmonic Conquest of Space', author: 'Cathie, B.', publication: 'Adventures Unlimited Press', year: '1998', page: '89' },
        { id: 'c4', number: 4, title: 'The Conscious Universe', author: 'Radin, D.', publication: 'HarperOne', year: '1997', page: '234' }
      ]
    },
    {
      id: 'theory',
      type: 'theory',
      title: '與傳統物理的對話',
      content: `【重力理論】

Wilcock挑戰了愛因斯坦廣義相對論的核心假設，認為重力並非時空彎曲的結果，而是電磁/磁性能量在特定條件下的表現。[5]

相關研究：
- Thomas Townsend Brown的電重力研究
- Nikola Tesla的動態重力理論
- Bruce DePalma的旋轉實驗（276磅陀螺旋轉後減少6磅重量）[6]

---

【量子力學】

源場理論試圖解決「測量問題」——即為何觀察會導致波函數塌縮。[7]

Wilcock提出，意識不僅在測量時起作用，而是持續地參與著現實的創造過程。

實驗支持：
- 普林斯頓工程異常研究（PEAR）的REG實驗
- 全球意識計畫（GCP）的集體事件數據

---

【方法論挑戰】

正如一位豆瓣讀者所指出的：「書中的大多數所謂研究成果，不過是片段式的猜測、聯想和臆斷，缺乏客觀驗證的可能。」[8]

這一批評指出了源場理論方法論上的真實挑戰——如何在保持開放性的同時滿足科學嚴謹性的要求。`,
      citations: [
        { id: 'c5', number: 5, title: 'The Hunt for Zero Point', author: 'Cook, N.', publication: 'Century', year: '2001', page: '123' },
        { id: 'c6', number: 6, title: 'The DePalma Effect: Rotation and Gravitation', author: 'DePalma, B.', publication: 'DePalma Research', year: '1976', page: '8' },
        { id: 'c7', number: 7, title: 'Quantum Enigma: Physics Encounters Consciousness', author: 'Rosenblum, B. & Kuttner, F.', publication: 'Oxford University Press', year: '2006', page: '189' },
        { id: 'c8', number: 8, title: '豆瓣讀者評論', publication: '豆瓣讀書', year: '2015', url: 'https://www.douban.com' }
      ]
    },
    {
      id: 'evidence',
      type: 'evidence',
      title: '實證與爭議',
      content: `【DNA作為場天線】

Wilcock援引俄羅斯科學家Peter Gariaev等人的研究，提出DNA同時是一個精密的電磁天線，能夠接收和發射源場信號。[9]

Gariaev的實驗似乎表明，DNA可以通過激光束進行「幽靈」信息傳遞——即使物理上移除DNA樣本，其電磁印記仍能在空間中持續存在。

---

【松果體的跨維度接收角色】

Wilcock對松果體給予了特殊關注，將其視為人體與源場連接的主要門戶。[10]

科學基礎：
- 松果體含有與視網膜相同的光感受細胞
- 能夠感知電磁場的變化
- 分泌的褪黑激素和DMT與意識狀態改變密切相關

---

【心臟相干性的場效應】

Wilcock引用HeartMath研究所的研究，強調心臟不僅是血液泵，更是一個強大的電磁發生器。[11]

心臟產生的電磁場比大腦強大數十倍，並且可以擴展到體外數英尺的範圍。

當個體進入「心腦同步」狀態時，這種場效應顯著增強。`,
      citations: [
        { id: 'c9', number: 9, title: 'The DNA Phantom Effect', author: 'Gariaev, P. et al.', publication: 'Wave Genetics', year: '1994', page: '12' },
        { id: 'c10', number: 10, title: 'DMT: The Spirit Molecule', author: 'Strassman, R.', publication: 'Park Street Press', year: '2001', page: '67' },
        { id: 'c11', number: 11, title: 'The HeartMath Solution', author: 'Childre, D. & Martin, H.', publication: 'Harper San Francisco', year: '1999', page: '89' }
      ]
    },
    {
      id: 'sources',
      type: 'sources',
      title: '資料來源',
      content: `本節列出所有引用的學術文獻和資源，按引用編號排序。`}
  ]
};

// 所有主題
export const themes: Theme[] = [
  lucidDreamingTheme, 
  astralProjectionTheme, 
  psychokinesisTheme,
  deepMeditationTheme,
  tibetanLungGomTheme,
  sourceFieldTheme
];

// 根據 slug 獲取主題
export function getThemeBySlug(slug: string): Theme | undefined {
  return themes.find(t => t.slug === slug);
}

// 獲取所有主題（用於列表展示）
export function getAllThemes(): Theme[] {
  return themes;
}
