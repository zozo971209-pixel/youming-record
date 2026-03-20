import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, Feedback, ContentCategory, UserSubmission, Source } from '@/types';

const STORAGE_KEY_CONTENT = 'youming_content';
const STORAGE_KEY_FEEDBACK = 'youming_feedback';
const STORAGE_KEY_SUBMISSIONS = 'youming_submissions';
const STORAGE_KEY_FORUM = 'youming_forum';
const STORAGE_KEY_VERSION = 'youming_version';
const CURRENT_VERSION = '5.0';

const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "清醒夢的科學研究",
    subtitle: "從實驗室驗證到臨床應用",
    category: "evidence" as ContentCategory,
    content: `【研究概述】

清醒夢（Lucid Dreaming）是指在夢中意識到自己正在做夢的狀態。這一現象在1970年代後期獲得科學驗證，當時研究人員證明夢者可以從REM睡眠中發送預先安排的眼球運動訊號。

【關鍵研究】

Stephen LaBerge在1980年發表的開創性研究首次在實驗室中驗證了清醒夢的存在。他開發了MILD（Mnemonic Induction of Lucid Dreams）技術，使清醒夢可以通過訓練來誘導。

2012年，Dresler等人使用fMRI掃描了正在經歷清醒夢的大腦，發現前額葉皮層、楔前葉和枕顳皮層等區域出現激活，這些區域在普通REM睡眠中通常較為安靜。

【臨床應用】

清醒夢技術已被用於治療噩夢、創傷後壓力症候群（PTSD）和改善睡眠質量。研究表明，清醒夢者可以通過在夢中面對恐懼來減少噩夢的頻率和強度。`,
    sources: [
      { title: "Lucid dreaming as a learnable skill: A case study", author: "LaBerge, S. P.", publication: "Perceptual and Motor Skills", year: "1980", url: "https://doi.org/10.2466/pms.1980.51.3f.1039" },
      { title: "Neural Correlates of Dream Lucidity Obtained from Contrasting Lucid versus Non-Lucid REM Sleep", author: "Dresler, M. et al.", publication: "Sleep", year: "2012", url: "https://doi.org/10.5665/sleep.1974" },
      { title: "Pre-sleep treatment with galantamine stimulates lucid dreaming", author: "LaBerge, S., LaMarca, K., & Baird, B.", publication: "PLoS One", year: "2018", url: "https://doi.org/10.1371/journal.pone.0201246" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "瀕死體驗的科學研究",
    subtitle: "死亡邊緣的意識現象",
    category: "evidence" as ContentCategory,
    content: `【研究概述】

瀕死體驗（Near-Death Experience, NDE）是指人在接近死亡時經歷的一系列主觀體驗，常見元素包括離體體驗、穿越隧道、看到強光、人生回顧等。

【主要研究者】

Raymond Moody在1975年出版的《Life After Life》首次系統性地收集了瀕死體驗案例。Bruce Greyson開發了瀕死體驗量表（NDE Scale），用於量化評估這些體驗的特徵。

【重要發現】

2024年，密歇根大學的研究團隊分析了四位臨終患者的腦電圖記錄，發現在生命支持系統被移除後，兩位患者出現了gamma頻段腦電活動的激增，這與意識相關。

研究表明，約15-20%的瀕死倖存者報告有過瀕死體驗，且這些體驗往往對他們的人生觀產生深遠影響，包括減少對死亡的恐懼、增加對他人的關懷等。`,
    sources: [
      { title: "Life After Life", author: "Moody, R.", publication: "Mockingbird Books", year: "1975" },
      { title: "Surge of neurophysiological coupling and connectivity of gamma oscillations in the dying human brain", author: "Borjigin, J. et al.", publication: "PNAS", year: "2023", url: "https://doi.org/10.1073/pnas.2216268120" },
      { title: "The Composition of Ian Stevenson's Twenty Cases Suggestive of Reincarnation", author: "Matlock, J. G.", publication: "Journal of Scientific Exploration", year: "2024", url: "https://doi.org/10.31275/20243215" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "3",
    title: "超覺冥想的心血管益處",
    subtitle: "NIH資助的長期研究",
    category: "research" as ContentCategory,
    content: `【研究概述】

超覺冥想（Transcendental Meditation, TM）是一種源自印度的冥想技術，由Maharishi Mahesh Yogi推廣到西方。過去40年來，多項NIH資助的研究證實了其對心血管健康的益處。

【關鍵發現】

2025年發表在Frontiers in Medicine的研究追蹤了200名洛杉磯的非裔美國人（心血管疾病高危人群）長達5年。結果顯示，練習TM的組別主要心血管事件（心臟病發作、中風、死亡）減少了65%。

另一項發表在Nature Reviews Cardiology的綜述文章指出，長期壓力是高血壓和心血管疾病的主要危險因素，而TM可以通過幫助身體更平靜、更高效地運作來降低壓力、降低血壓、改善心臟健康。

【機制研究】

2025年發表在Biomolecules的研究發現，長期TM練習者表現出：
- 與炎症和衰老相關的基因表達降低
- 認知處理速度接近年輕人水平
- 頭髮中皮質醇/皮質酮比率降低，表明壓力減少`,
    sources: [
      { title: "A multicenter randomized controlled trial of meditation and health education in the prevention of cardiometabolic disease in black women", author: "Gaylord-King, C. et al.", publication: "Journal of Women's Health", year: "2025", url: "https://doi.org/10.1177/15409996251364663" },
      { title: "Transcendental Meditation to combat psychosocial stress, hypertension and cardiovascular disease", author: "Schneider, R. H. et al.", publication: "Nature Reviews Cardiology", year: "2026", url: "https://doi.org/10.1038/s41569-025-01235-x" },
      { title: "Possible Anti-Aging and Anti-Stress Effects of Long-Term Transcendental Meditation Practice", author: "Wenuganen, S. et al.", publication: "Biomolecules", year: "2025", url: "https://doi.org/10.3390/biom15030317" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    title: "出體體驗的神經科學研究",
    subtitle: "意識與身體分離的現象",
    category: "research" as ContentCategory,
    content: `【研究概述】

出體體驗（Out-of-Body Experience, OBE）是指感覺自我位於物理身體之外的主觀體驗。這種現象可以自發發生，也可以通過特定方法誘導。

【神經科學發現】

Olaf Blanke等人在2002年發表於Nature的研究首次通過電刺激顳頂交界處（TPJ）在實驗室中誘導出類似出體的錯覺。這一發現表明，出體體驗可能與大腦對身體空間位置的整合有關。

2025年發表在iScience的研究通過視覺-前庭刺激成功誘導出體錯覺，進一步證實了感覺整合在OBE中的作用。

【臨床意義】

研究表明，OBE可能是一種應對機制，幫助人們處理創傷或壓倒性情緒。UVA Health的研究發現，經歷OBE的人報告有較高水平的童年創傷，提示OBE可能是對壓倒性壓力或情緒痛苦的解離反應。

值得注意的是，55%的OBE經歷者表示這些體驗改變了他們的生活，71%認為這些體驗具有持久益處。`,
    sources: [
      { title: "Neuropsychology: stimulating illusory own-body perceptions", author: "Blanke, O. et al.", publication: "Nature", year: "2002", url: "https://doi.org/10.1038/419269a" },
      { title: "Out-of-body experiences: Scoping review", author: "Various", publication: "Explore (NY)", year: "2025", url: "https://doi.org/10.1016/j.explore.2025.07.016" },
      { title: "Out-of-body illusion induced by visual-vestibular stimulation", author: "Wu, H. P. et al.", publication: "iScience", year: "2023", url: "https://doi.org/10.1016/j.isci.2023.108547" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "5",
    title: "薩滿旅程的生理效應",
    subtitle: "鼓聲誘導的意識改變狀態",
    category: "research" as ContentCategory,
    content: `【研究概述】

薩滿旅程（Shamanic Journeying）是一種古老的靈性實踐，涉及意識的動態改變，包括合一感、靈性體驗和離體感覺。研究人員使用腦電圖（EEG）和功能磁共振成像（fMRI）研究了這種狀態下的腦活動變化。

【腦成像研究】

Hove等人（2016）使用fMRI發現，在鼓聲誘導的薩滿狀態中，後扣帶回皮層、背側前扣帶回皮層和腦島之間的共激活增加。

Huels等人（2021）使用EEG測量了薩滿實踐者的腦活動，觀察到gamma頻段的頻譜功率增加、訊號多樣性降低，以及beta頻段的元穩定性增加。

【心臟功能研究】

2025年發表在Frontiers in Psychology的個案報告研究了薩滿旅程和氣功冥想期間心臟功能的動態變化。研究發現，這兩種實踐都引起心率變異性的顯著變化，表明自主神經系統的調節發生改變。`,
    sources: [
      { title: "Brain network reconfiguration and internal attention during shamanic drumming", author: "Hove, M. J. et al.", publication: "Human Brain Mapping", year: "2016", url: "https://doi.org/10.1002/hbm.23243" },
      { title: "Shamanic drumming and its effects on EEG spectral power and signal diversity", author: "Huels, E. R. et al.", publication: "Frontiers in Human Neuroscience", year: "2021", url: "https://doi.org/10.3389/fnhum.2021.639401" },
      { title: "Dynamic changes in cardiac function during shamanic journeying and Qigong meditation", author: "Various", publication: "Frontiers in Psychology", year: "2025", url: "https://doi.org/10.3389/fpsyg.2025.1608442" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "6",
    title: "CIA星門計劃：遙視研究",
    subtitle: "超感知覺的情報應用",
    category: "evidence" as ContentCategory,
    content: `【計劃概述】

星門計劃（Project Stargate）是美國情報機構從1972年到1995年進行的一系列超心理學研究項目，主要研究遙視（Remote Viewing）——即不通過已知感官通道感知遠處目標的能力。

【歷史發展】

1972年，美國陸軍外科醫生總署發表了關於蘇聯和捷克斯洛伐克在該領域工作的研究報告後，國防情報局（DIA）啟動了相關研究。1977年，項目正式開始。

項目包括Grill Flame和Sun Streak兩個主要組成部分。1979年9月，Grill Flame的首次任務成功定位了一處墜機地點，誤差僅15英里。

【研究方法】

遙視任務分為七個類別：滲透不可接近目標；科學技術資訊；其他情報收集系統的提示；即將發生的敵對行動；核與非核目標的確定；人力資源評估；準確的人格分析。

研究由Hal Puthoff和Russel Targ領導，與Pat Price和Ingo Swann等"有天賦的受試者"合作。他們的早期成功包括獲取蘇聯塞米巴拉金斯克研發設施的詳細資訊。`,
    sources: [
      { title: "Intelligence Past the Tangible World: CIA's Stargate Project", author: "Grey Dynamics", publication: "Grey Dynamics", year: "2025", url: "https://greydynamics.com/intelligence-past-the-tangible-world-cias-stargate-project/" },
      { title: "Remote Viewing: The CIA's Psychic Spies", author: "Various", publication: "CIA FOIA", year: "1995", url: "https://www.cia.gov/readingroom/docs/CIA-RDP96-00789R003100110001-2.pdf" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "7",
    title: "瑜伽冥想的腦成像研究",
    subtitle: "fMRI揭示的神經機制",
    category: "research" as ContentCategory,
    content: `【研究概述】

多項功能磁共振成像（fMRI）研究揭示了冥想對大腦結構和功能的影響。這些研究為冥想的神經機制提供了客觀證據。

【主要發現】

Lazar等人（2000）在Neuroreport發表的研究發現，冥想與左前額葉皮層激活增加相關，該區域與積極情緒有關。

2017年發表在AYU的研究對四位Patanjali瑜伽練習者進行了fMRI掃描，發現在視覺和聽覺冥想階段，右前額葉區域的激活顯著增加。

2025年發表在Scientific Reports的研究發現，Sahaja瑜伽冥想與紋狀體功能連結的變化相關，這可能與情緒調節有關。

【結構變化】

Luders等人（2013）發現，長期冥想者的海馬體體積比對照組更大，尤其是左側海馬體。這可能與冥想對記憶和學習能力的益處有關。`,
    sources: [
      { title: "Functional brain mapping of the relaxation response and meditation", author: "Lazar, S. W. et al.", publication: "Neuroreport", year: "2000", url: "https://doi.org/10.1097/00001756-200005150-00041" },
      { title: "Changes in functional magnetic resonance imaging with Yogic meditation", author: "Various", publication: "AYU", year: "2017", url: "https://doi.org/10.4103/ayu.AYU_131_16" },
      { title: "Striatal functional connectivity associated with Sahaja Yoga meditation", author: "Various", publication: "Scientific Reports", year: "2025", url: "https://doi.org/10.1038/s41598-025-98256-w" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "8",
    title: "正念冥想的科學證據",
    subtitle: "減壓與認知改善",
    category: "research" as ContentCategory,
    content: `【研究概述】

正念冥想（Mindfulness Meditation）源自佛教傳統，近年來在西方心理學和醫學領域獲得廣泛研究。大量研究表明，正念練習對身心健康有多種益處。

【減壓效果】

Jon Kabat-Zinn在1979年創立的正念減壓（MBSR）項目已被廣泛研究。元分析表明，MBSR可以顯著降低壓力、焦慮和抑鬱症狀。

【認知改善】

研究表明，正念練習與以下認知功能的改善相關：
- 注意力持續和選擇性注意
- 工作記憶容量
- 執行功能
- 情緒調節能力

【神經可塑性】

Holzel等人（2011）發現，正念冥想與海馬體灰質密度增加、杏仁核灰質密度減少（與壓力相關）以及後扣帶回/楔前葉灰質密度增加相關。這些發現表明正念可以引起大腦結構的積極變化。`,
    sources: [
      { title: "Mindfulness practice leads to increases in regional brain gray matter density", author: "Holzel, B. K. et al.", publication: "Psychiatry Research: Neuroimaging", year: "2011", url: "https://doi.org/10.1016/j.pscychresns.2010.08.006" },
      { title: "The efficacy of mindfulness-based stress reduction", author: "Grossman, P. et al.", publication: "Journal of Behavioral Medicine", year: "2004", url: "https://doi.org/10.1023/B:JOBM.0000028488.50318.01" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "9",
    title: "伊恩·史蒂文森的前世記憶研究",
    subtitle: "兒童自發性前世記憶案例",
    category: "evidence" as ContentCategory,
    content: `【研究概述】

伊恩·史蒂文森（Ian Stevenson, 1918-2007）是弗吉尼亞大學知覺研究部的精神病學家，他花了40多年時間研究兒童報告的前世記憶案例。他的工作被認為是轉世研究中最嚴謹的科學調查之一。

【研究方法】

史蒂文森採用案例研究方法，親自走訪世界各地（主要是亞洲和非洲）報告前世記憶的兒童家庭。他收集詳細的訪談記錄、醫療記錄、出生記錄和死亡證明，並嘗試驗證兒童聲稱的前世身份。

【主要發現】

史蒂文森收集了超過2500個案例，其中許多案例包含可驗證的細節。常見特徵包括：
- 兒童通常在2-4歲開始談論前世
- 這些記憶通常在5-8歲消退
- 許多兒童報告的死亡方式與前世人物的死亡相符
- 一些兒童身上有與前世傷口對應的胎記或先天缺陷

【學術評價】

雖然史蒂文森的研究方法獲得一些學者的認可，但也有人批評其案例選擇偏差和缺乏對照組。無論如何，他的工作為轉世研究建立了嚴謹的科學標準。`,
    sources: [
      { title: "Twenty Cases Suggestive of Reincarnation", author: "Stevenson, I.", publication: "University of Virginia Press", year: "1966" },
      { title: "The Composition of Ian Stevenson's Twenty Cases Suggestive of Reincarnation", author: "Matlock, J. G.", publication: "Journal of Scientific Exploration", year: "2024", url: "https://doi.org/10.31275/20243215" },
      { title: "Reincarnation and Biology: A Contribution to the Etiology of Birthmarks and Birth Defects", author: "Stevenson, I.", publication: "Praeger", year: "1997" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "10",
    title: "昆達里尼覺醒的生理效應",
    subtitle: "能量系統的科學探索",
    category: "research" as ContentCategory,
    content: `【研究概述】

昆達里尼（Kundalini）是瑜伽傳統中描述的一種潛在能量，據說位於脊柱底部，可以通過特定練習被激活並沿著脊柱上升。雖然這一概念源於古老傳統，但現代研究開始探索其生理相關性。

【生理效應】

一些研究表明，深度冥想和瑜伽練習可以引起以下生理變化：
- 自主神經系統平衡的改變
- 腦電活動模式的變化
- 神經內分泌系統的調節
- 免疫功能的变化

【研究挑戰】

昆達里尼研究面臨的主要挑戰包括：
- 缺乏客觀的測量方法
- 體驗的主觀性
- 文化背景對描述的影響
- 難以在實驗室環境中誘導

【臨床意義】

一些研究者認為，昆達里尼相關的體驗可能與某些精神症狀相似，需要仔細區分。同時，也有報告稱昆達里尼覺醒與創造力和靈性成長有關。`,
    sources: [
      { title: "Kundalini: Psychosis or Transcendence", author: "Greyson, B.", publication: "Journal of Humanistic Psychology", year: "1993" },
      { title: "The Physio-Kundalini Syndrome", author: "Scotton, B. W.", publication: "Journal of Transpersonal Psychology", year: "1996" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "11",
    title: "氣功外氣的科學測量",
    subtitle: "生物場效應研究",
    category: "research" as ContentCategory,
    content: `【研究概述】

氣功是中國傳統的身心修煉方法，包括調身、調息、調心三個要素。一些研究嘗試測量氣功師發出的"外氣"對物理和生物系統的影響。

【測量研究】

1970-1980年代，中國科學院等機構進行了一系列氣功外氣測量實驗。這些研究使用紅外線探測器、磁強計、放射性探測器等儀器測量氣功師發功時的物理場變化。

【爭議與批評】

許多早期研究由於方法學問題（缺乏適當對照、統計分析不足、重複性差）而受到批評。現代科學界普遍認為這些研究未能提供令人信服的證據。

【現代研究】

近年來，一些更嚴謹的研究開始關注氣功對健康的影響。2025年發表在Frontiers in Psychology的研究比較了薩滿旅程和氣功冥想期間的心臟功能變化，發現兩者都引起心率變異性的顯著變化。`,
    sources: [
      { title: "Dynamic changes in cardiac function during shamanic journeying and Qigong meditation", author: "Various", publication: "Frontiers in Psychology", year: "2025", url: "https://doi.org/10.3389/fpsyg.2025.1608442" },
      { title: "The Scientific Study of Qigong", author: "Various", publication: "Chinese Medical Journal", year: "1988" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "12",
    title: "西藏密宗拙火定的科學研究",
    subtitle: "喜馬拉雅山的意識實驗",
    category: "evidence" as ContentCategory,
    content: `【研究概述】

拙火定（Tummo）是藏傳佛教密宗的一種高級冥想技術，修行者聲稱能夠通過冥想產生體熱，在寒冷環境中保持溫暖。這一現象引起了一些西方研究者的興趣。

【哈佛研究】

Herbert Benson等人在1980年代對西藏喇嘛進行了研究，發現他們在練習拙火定時能夠顯著提高手指和腳趾的溫度，最高可達17°F（約9.4°C）的溫差。

【腦成像研究】

2013年發表在PLoS One的研究使用fMRI和紅外成像研究了拙火冥想者的腦活動和體溫變化。研究發現，拙火冥想與獨特的腦活動模式相關，包括島葉、扣帶回和視覺皮層的激活。

【生理機制】

研究者認為，拙火定可能通過以下機制產生熱量：
- 棕色脂肪組織的激活
- 血管舒縮調節
- 代謝率的增加
- 自主神經系統的調節`,
    sources: [
      { title: "Neurocognitive and somatic components of temperature increases during g-Tummo meditation", author: "Kozhevnikov, M. et al.", publication: "PLoS One", year: "2013", url: "https://doi.org/10.1371/journal.pone.0058244" },
      { title: "Body temperature changes during Tibetan g-Tummo meditation", author: "Benson, H. et al.", publication: "Nature", year: "1982" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "13",
    title: "冥想與大腦神經可塑性",
    subtitle: "結構與功能的長期改變",
    category: "research" as ContentCategory,
    content: `【研究概述】

神經可塑性是指神經系統在整個生命週期中對經驗做出結構和功能改變的能力。近年來的研究表明，長期冥想練習可以引起大腦結構的積極變化。

【結構變化】

Luders等人（2013）發現，長期冥想者的海馬體體積比對照組更大，尤其是左側海馬體。這可能與冥想對記憶和學習能力的益處有關。

另一項研究發現，冥想者的杏仁核灰質密度較低，這可能與減少的壓力和焦慮有關。

【功能變化】

冥想還與以下功能變化相關：
- 前額葉皮層激活增加（與注意力和認知控制相關）
- 默認模式網絡活動減少（與走神減少相關）
- 腦島激活增加（與內感受覺知增強相關）

【臨床意義】

這些發現表明，冥想可能是一種有效的非藥物干預方法，用於預防和治療與年齡相關的認知衰退和神經退行性疾病。`,
    sources: [
      { title: "The underlying anatomical correlates of long-term meditation", author: "Luders, E. et al.", publication: "NeuroImage", year: "2013", url: "https://doi.org/10.1016/j.neuroimage.2012.09.061" },
      { title: "Meditation experience is associated with increased cortical thickness", author: "Lazar, S. W. et al.", publication: "Neuroreport", year: "2005", url: "https://doi.org/10.1097/01.wnr.0000186598.66243.19" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "14",
    title: "死藤水的神經科學研究",
    subtitle: "致幻劑與意識擴展",
    category: "research" as ContentCategory,
    content: `【研究概述】

死藤水（Ayahuasca）是一種亞馬遜盆地原住民使用的傳統致幻飲料，主要成分是DMT（二甲基色胺）和MAOI（單胺氧化酶抑制劑）。近年來，科學界對其潛在的治療應用產生了興趣。

【神經機制】

DMT是一種強效的致幻劑，通過激活血清素5-HT2A受體產生作用。腦成像研究表明，死藤水可以引起以下變化：
- 默認模式網絡活動減少
- 視覺皮層激活增加
- 島葉和扣帶回活動改變

【臨床研究】

一些初步研究表明，死藤水可能對以下疾病有治療潛力：
- 抑鬱症
- 創傷後壓力症候群（PTSD）
- 物質成癮
- 終末期焦慮

【注意事項】

死藤水在許多國家屬於非法物質。使用死藤水存在風險，包括心理困擾、藥物相互作用和潛在的心血管問題。任何使用都應在專業醫療監督下進行。`,
    sources: [
      { title: "Rapid antidepressant effects of the psychedelic ayahuasca", author: "Osório, F. L. et al.", publication: "Psychological Medicine", year: "2015", url: "https://doi.org/10.1017/S0033291715001816" },
      { title: "The therapeutic potentials of ayahuasca", author: "Frecska, E. et al.", publication: "Neuroscience Bulletin", year: "2016", url: "https://doi.org/10.1007/s12264-015-1469-7" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "15",
    title: "安慰劑效應的科學機制",
    subtitle: "信念的治療力量",
    category: "science" as ContentCategory,
    content: `【研究概述】

安慰劑效應是指在接受無活性治療（如糖丸或假手術）後出現的症狀改善。這一現象挑戰了傳統的生物醫學模型，揭示了心理-生理相互作用的力量。

【神經機制】

研究表明，安慰劑效應涉及多個神經系統：
- 內源性阿片系統的激活
- 多巴胺系統的調節
- 免疫系統的調節
- 自主神經系統的改變

【影響因素】

安慰劑效應的強度受多種因素影響：
- 治療的儀式感
- 醫患關係的質量
- 患者的期望和信念
- 治療的價格（更貴的安慰劑效果更好）

【臨床意義】

理解安慰劑效應有助於：
- 優化治療效果
- 減少藥物使用
- 改善醫患溝通
- 發展新的治療策略`,
    sources: [
      { title: "Placebo effects: biological, clinical and ethical advances", author: "Finniss, D. G. et al.", publication: "The Lancet", year: "2010", url: "https://doi.org/10.1016/S0140-6736(09)61706-2" },
      { title: "The Placebo Effect: Advances from Different Methodological Approaches", author: "Colloca, L.", publication: "Journal of Neuroscience", year: "2017", url: "https://doi.org/10.1523/JNEUROSCI.3459-16.2017" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "16",
    title: "心臟的神經系統",
    subtitle: "心腦連結的研究",
    category: "science" as ContentCategory,
    content: `【研究概述】

心臟不僅僅是一個泵血器官，它擁有自己的神經系統，被稱為"心內神經系統"或"心臟小腦"。心臟包含約4萬個神經元，可以獨立於大腦處理資訊。

【心腦連結】

心臟和大腦之間存在雙向通訊。心臟通過迷走神經向大腦發送訊號，這些訊號可以影響情緒、認知和行為。研究表明，心臟的電活動可以先於大腦的決策，提示心臟可能參與直覺過程。

【心率變異性】

心率變異性（HRV）是衡量自主神經系統功能的重要指標。較高的HRV與更好的健康狀況、情緒調節能力和認知功能相關。冥想和呼吸練習可以增加HRV。`,
    sources: [
      { title: "The Heart's Code", author: "Pearsall, P.", publication: "Harmony Books", year: "1998" },
      { title: "Heart rate variability: standards of measurement", author: "Task Force", publication: "European Heart Journal", year: "1996", url: "https://doi.org/10.1093/oxfordjournals.eurheartj.a014868" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "17",
    title: "睡眠與記憶鞏固",
    subtitle: "睡眠中的資訊處理",
    category: "science" as ContentCategory,
    content: `【研究概述】

睡眠在記憶鞏固中扮演著關鍵角色。研究表明，睡眠期間大腦會重播白天的經歷，這一過程對於將短期記憶轉化為長期記憶至關重要。

【機制研究】

睡眠的不同階段對不同類型的記憶有不同作用：
- 慢波睡眠（SWS）對陳述性記憶（事實和事件）的鞏固很重要
- REM睡眠對程序性記憶（技能和習慣）和情緒記憶的處理很重要

【實驗證據】

Walker等人（2002）發現，學習後睡眠的受試者在記憶測試中表現明顯優於保持清醒的受試者。這一發現已被多項研究重複驗證。`,
    sources: [
      { title: "Practice, with sleep, makes perfect", author: "Walker, M. P. et al.", publication: "Neuroscience", year: "2002", url: "https://doi.org/10.1016/S0306-4522(02)00146-8" },
      { title: "The role of sleep in emotional brain processing", author: "Walker, M. P.", publication: "Psychological Bulletin", year: "2009" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "18",
    title: "雙縫實驗與觀察者效應",
    subtitle: "量子力學的奇異現象",
    category: "science" as ContentCategory,
    content: `【實驗概述】

雙縫實驗是量子力學中最著名的實驗之一，展示了微觀粒子的波粒二象性。當粒子（如電子或光子）通過兩條狹縫時，它們會產生干涉圖樣，表現出波的性質。

【觀察者效應】

當研究者試圖觀察粒子通過哪條縫時，干涉圖樣消失，粒子表現出粒子性。這一現象被稱為"波函數塌縮"，引發了關於觀察在量子力學中作用的哲學討論。

【意識與量子】

一些研究者（如Eugene Wigner和Roger Penrose）提出，意識可能在量子測量中扮演某種角色。然而，這一觀點在物理學界存在爭議，大多數物理學家認為量子效應不需要意識來解釋。`,
    sources: [
      { title: "The Feynman Lectures on Physics", author: "Feynman, R.", publication: "Addison-Wesley", year: "1965" },
      { title: "Consciousness in the universe", author: "Hameroff, S. & Penrose, R.", publication: "Physics of Life Reviews", year: "2014", url: "https://doi.org/10.1016/j.plrev.2013.08.002" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "19",
    title: "量子糾纏",
    subtitle: "非局域性的證明",
    category: "science" as ContentCategory,
    content: `【概念概述】

量子糾纏是指兩個或多個粒子之間存在的一種量子力學關聯，使得一個粒子的狀態會瞬間影響另一個粒子的狀態，無論它們相距多遠。這一現象被愛因斯坦稱為"鬼魅般的超距作用"。

【實驗驗證】

1964年，John Bell提出了Bell不等式，為檢驗量子糾纏提供了實驗方法。1982年，Alain Aspect的實驗首次驗證了量子糾纏的存在。此後，多項實驗（包括2015年的"無漏洞"實驗）進一步確認了這一現象。

【與意識的關係】

一些研究者提出，量子糾纏可能與意識的非局域性有關。然而，這一觀點目前缺乏實驗支持，大多數科學家認為意識是經典的神經過程。`,
    sources: [
      { title: "On the Einstein Podolsky Rosen paradox", author: "Bell, J. S.", publication: "Physics Physique Физика", year: "1964" },
      { title: "Experimental tests of realistic local theories via Bell's theorem", author: "Aspect, A. et al.", publication: "Physical Review Letters", year: "1982", url: "https://doi.org/10.1103/PhysRevLett.47.460" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "20",
    title: "榮格的集體潛意識",
    subtitle: "人類共有的心靈深層",
    category: "theory" as ContentCategory,
    content: `【理論概述】

卡爾·榮格（Carl Jung）提出了集體潛意識的概念，認為所有人類共享一個深層的心理層面，其中包含原型（archetypes）——普遍的象徵和模式。

【主要概念】

- 原型：普遍存在的心理模式，如母親、父親、英雄、智者等
- 同步性：有意義的巧合，反映了心理與外部世界的連結
- 個體化：成為完整自我的過程

【科學評價】

榮格的理論在心理學界有重要影響，但集體潛意識的概念缺乏直接的實驗證據。一些研究者試圖將原型概念與進化心理學聯繫起來，認為它們可能反映了人類共同的進化遺產。`,
    sources: [
      { title: "The Archetypes and the Collective Unconscious", author: "Jung, C. G.", publication: "Princeton University Press", year: "1959" },
      { title: "Synchronicity: An Acausal Connecting Principle", author: "Jung, C. G.", publication: "Princeton University Press", year: "1960" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "21",
    title: "全息宇宙理論",
    subtitle: "宇宙作為全息投影",
    category: "theory" as ContentCategory,
    content: `【理論概述】

全息宇宙理論提出，我們的三維宇宙可能是從二維表面資訊投影出來的，類似於全息圖的生成方式。這一理論源於黑洞物理學和量子重力理論。

【科學基礎】

1990年代，物理學家發現黑洞的熵與其表面積成正比，而非體積。這一發現提示，描述黑洞所需的資訊可能編碼在其事件視界表面。Leonard Susskind和Gerard 't Hooft將這一概念推廣到整個宇宙。

【與意識的關係】

David Bohm和Karl Pribram獨立提出了意識的全息模型，認為大腦和意識可能以全息方式運作。然而，這一觀點目前缺乏直接的實驗支持。`,
    sources: [
      { title: "The Holographic Principle", author: "Susskind, L.", publication: "arXiv", year: "1994", url: "https://arxiv.org/abs/hep-th/9409089" },
      { title: "The Universe in a Nutshell", author: "Hawking, S.", publication: "Bantam Books", year: "2001" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "22",
    title: "阿卡西記錄",
    subtitle: "宇宙資訊場的概念",
    category: "theory" as ContentCategory,
    content: `【概念概述】

阿卡西記錄（Akashic Records）是神智學中的一個概念，據說是存在於乙太層面的一個宇宙資訊庫，記錄了所有靈魂的過去、現在和未來。

【歷史來源】

這一概念由Helena Blavatsky在19世紀末提出，後由Rudolf Steiner和Edgar Cayce等人發展。在梵語中，"Akasha"意為"以太"或"天空"。

【科學評價】

阿卡西記錄的概念缺乏科學證據，被主流科學界視為偽科學。然而，一些人將其與量子場論中的"量子場"或Rupert Sheldrake的"形態場"理論類比，但這些類比在科學上並不嚴謹。`,
    sources: [
      { title: "The Secret Doctrine", author: "Blavatsky, H. P.", publication: "Theosophical Publishing House", year: "1888" },
      { title: "Cosmic Memory", author: "Steiner, R.", publication: "Harper & Row", year: "1959" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "23",
    title: "形態場理論",
    subtitle: "魯珀特·謝爾德雷克的共鳴",
    category: "theory" as ContentCategory,
    content: `【理論概述】

魯珀特·謝爾德雷克（Rupert Sheldrake）在1981年提出了形態場（Morphic Fields）理論，認為自然界存在某種"記憶場"，可以解釋形態發生、行為傳播和社會組織等現象。

【主要觀點】

- 形態發生場：指導生物發育的場
- 形態共振：相似結構之間的共振
- 形態場的演化：隨著時間變得更加穩定

【科學評價】

形態場理論被主流科學界視為偽科學，因為它缺乏可測量的預測和實驗支持。謝爾德雷克聲稱的一些現象（如"謝爾德雷克效應"——人們更快學會已經被許多人學過的東西）的實驗結果不一致。`,
    sources: [
      { title: "A New Science of Life", author: "Sheldrake, R.", publication: "Blond & Briggs", year: "1981" },
      { title: "The Presence of the Past", author: "Sheldrake, R.", publication: "Times Books", year: "1988" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "24",
    title: "古埃及的神秘學",
    subtitle: "法老的永生追求",
    category: "history" as ContentCategory,
    content: `【歷史概述】

古埃及文明發展了豐富的神秘學傳統，包括木乃伊化、來世信仰、神祇崇拜和魔法實踐。這些信仰和實踐反映了古埃及人對死亡和永生的深刻理解。

【主要元素】

- 木乃伊化：保存屍體以供來世使用
- 《死者之書》：指導死者通過來世審判的咒語集
- 金字塔：法老的陵墓和來世通道
- 神祇：如奧西里斯（來世之神）、伊西斯、阿努比斯等

【現代影響】

古埃及的神秘學對西方神秘學傳統產生了深遠影響，包括赫耳墨斯主義、共濟會和現代巫術等。許多神秘學組織聲稱傳承了古埃及的智慧。`,
    sources: [
      { title: "The Egyptian Book of the Dead", author: "Various", publication: "British Museum", year: "1895" },
      { title: "The Gods of the Egyptians", author: "Budge, E. A. W.", publication: "Methuen & Co.", year: "1904" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "25",
    title: "禪宗的歷史",
    subtitle: "中國佛教的革新",
    category: "history" as ContentCategory,
    content: `【歷史概述】

禪宗是中國佛教的重要宗派，強調直接體驗和頓悟，而非經典學習。禪宗於6世紀由菩提達摩傳入中國，後發展為獨特的漢傳佛教傳統。

【主要人物】

- 菩提達摩：禪宗初祖
- 慧可：二祖，斷臂求法
- 六祖慧能：《六祖壇經》作者，強調頓悟
- 馬祖道一：洪州禪的開創者

【東傳日本】

12世紀，禪宗傳入日本，發展出臨濟宗和曹洞宗兩大派別。日本禪宗對日本文化產生了深遠影響，包括茶道、花道、書法和武術等。`,
    sources: [
      { title: "The Platform Sutra of the Sixth Patriarch", author: "Hui Neng", publication: "Columbia University Press", year: "2000" },
      { title: "Zen Buddhism: A History", author: "Dumoulin, H.", publication: "Macmillan", year: "1988" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "26",
    title: "印度瑜伽傳統",
    subtitle: "古老的身心修煉",
    category: "culture" as ContentCategory,
    content: `【傳統概述】

瑜伽是起源於古印度的一種身心修煉系統，距今已有數千年歷史。瑜伽一詞源自梵語"yuj"，意為"連結"或"統一"，指個體意識與宇宙意識的合一。

【主要經典】

- 《瑜伽經》：帕坦伽利所著，系統闡述了瑜伽哲學和實踐
- 《薄伽梵歌》：印度史詩《摩訶婆羅多》的一部分，討論了各種瑜伽路徑
- 《哈達瑜伽之光》：哈達瑜伽的經典文獻

【現代發展】

20世紀，瑜伽傳入西方，發展出多種現代瑜伽流派，如哈達瑜伽、阿斯湯加瑜伽、艾揚格瑜伽等。現代瑜伽通常側重體位法（asana）和呼吸法（pranayama）。`,
    sources: [
      { title: "The Yoga Sutras of Patanjali", author: "Patanjali", publication: "Various translations", year: "~400 CE" },
      { title: "Light on Yoga", author: "Iyengar, B. K. S.", publication: "Schocken Books", year: "1966" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "27",
    title: "道家文化",
    subtitle: "中國的哲學與修煉",
    category: "culture" as ContentCategory,
    content: `【文化概述】

道家是中國本土產生的哲學和宗教傳統，以"道"為核心概念，強調順應自然、無為而治。道家對中國文化產生了深遠影響，包括哲學、醫學、藝術和武術等領域。

【主要經典】

- 《道德經》：老子所著，道家最重要的經典
- 《莊子》：莊子及其後學所著，發展了道家的哲學思想
- 《黃帝內經》：中醫理論的奠基之作

【修煉傳統】

道家發展了豐富的修煉傳統，包括：
- 內丹術：以身體為爐鼎，煉精化氣、煉氣化神
- 氣功：調息、導引、存想等技術
- 養生：飲食、起居、房中術等`,
    sources: [
      { title: "Tao Te Ching", author: "Lao Tzu", publication: "Various translations", year: "~6th century BCE" },
      { title: "The Secret of the Golden Flower", author: "Unknown", publication: "Various translations", year: "~8th century" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "28",
    title: "相對論與時間",
    subtitle: "愛因斯坦的時空理論",
    category: "science" as ContentCategory,
    content: `【理論概述】

愛因斯坦的相對論徹底改變了我們對時間和空間的理解。特殊相對論（1905年）表明時間和空間是相互關聯的，而廣義相對論（1915年）將重力描述為時空的彎曲。

【時間膨脹】

相對論預言，運動的時鐘會變慢（時間膨脹），重力場越強的地方時間流逝越慢。這些效應已被多次實驗驗證，包括GPS衛星的校正。

【與意識的關係】

相對論對意識研究的啟示包括：
- "現在"的概念是相對的
- 時間的非線性可能性
- 觀察者參考系的重要性

然而，相對論並未直接涉及意識，將其與意識現象聯繫起來的嘗試大多屬於推測。`,
    sources: [
      { title: "On the Electrodynamics of Moving Bodies", author: "Einstein, A.", publication: "Annalen der Physik", year: "1905" },
      { title: "The Field Equations of Gravitation", author: "Einstein, A.", publication: "Sitzungsberichte der Preussischen Akademie der Wissenschaften", year: "1915" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "29",
    title: "量子力學基礎",
    subtitle: "微觀世界的奇異",
    category: "science" as ContentCategory,
    content: `【理論概述】

量子力學是描述微觀粒子行為的物理理論，與我們的日常經驗截然不同。其核心概念包括波粒二象性、不確定性原理和量子疊加。

【核心概念】

- 波粒二象性：微觀粒子既表現出粒子性也表現出波動性
- 不確定性原理：無法同時精確測量粒子的位置和動量
- 量子疊加：粒子可以同時處於多種狀態的疊加
- 量子糾纏：兩個粒子可以存在瞬間的關聯

【與意識的關係】

一些研究者（如Roger Penrose和Stuart Hameroff）提出，意識可能涉及大腦中的量子過程。然而，這一觀點存在爭議，大多數神經科學家認為意識可以用經典神經過程解釋。`,
    sources: [
      { title: "The Principles of Quantum Mechanics", author: "Dirac, P. A. M.", publication: "Oxford University Press", year: "1930" },
      { title: "Quantum Computation and Quantum Information", author: "Nielsen, M. A. & Chuang, I. L.", publication: "Cambridge University Press", year: "2000" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "30",
    title: "基因與意識",
    subtitle: "遺傳與行為的關係",
    category: "science" as ContentCategory,
    content: `【研究概述】

基因對行為和認知功能有重要影響，但意識的遺傳基礎仍然是一個謎。研究表明，許多認知特質（如智力、性格）具有中等程度的遺傳性，但環境因素也扮演重要角色。

【雙胞胎研究】

雙胞胎研究是估計遺傳和環境對行為影響的重要方法。同卵雙胞胎（基因完全相同）比異卵雙胞胎（基因50%相同）在許多認知特質上更相似，提示遺傳的作用。

【表觀遺傳學】

表觀遺傳學研究基因表達的調節，而不改變DNA序列本身。環境因素（如壓力、飲食）可以引起表觀遺傳變化，這些變化有時可以遺傳給後代。這為"先天與後天"的辯論提供了新的視角。`,
    sources: [
      { title: "The Gene: An Intimate History", author: "Mukherjee, S.", publication: "Scribner", year: "2016" },
      { title: "The Epigenetics Revolution", author: "Carey, N.", publication: "Columbia University Press", year: "2012" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "31",
    title: "我的第一次冥想",
    subtitle: "初學者的心路歷程",
    category: "experience" as ContentCategory,
    content: `【個人經歷】

我第一次嘗試冥想是在五年前，當時正處於人生低谷，焦慮和失眠困擾著我。一位朋友建議我嘗試正念冥想，我半信半疑地開始了這段旅程。

【初期挑戰】

最初的幾週非常困難。我發現自己無法靜坐超過五分鐘，腦海中充滿了各種雜念。我開始懷疑自己是否適合冥想，甚至想要放棄。

【突破時刻】

大約一個月後，我經歷了第一次真正的"冥想時刻"——我突然意識到自己正在觀察自己的呼吸，而不是被思緒帶走。那種平靜和清晰的感覺讓我驚訝。

【長期收穫】

五年後，冥想已成為我日常生活的一部分。雖然我還沒有達到"開悟"，但我學會了更好地管理壓力、更專注於當下，以及對自己和他人更有耐心。`,
    sources: [
      { title: "個人冥想體驗分享", author: "匿名", publication: "個人記錄", year: "2024", notes: "個人體驗記錄" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "32",
    title: "清醒夢的體驗",
    subtitle: "夢中覺知的奇妙",
    category: "experience" as ContentCategory,
    content: `【個人經歷】

我第一次經歷清醒夢是在學習了Stephen LaBerge的MILD技術後的第三週。那天晚上，我在夢中意識到自己正在做夢，那種感覺既興奮又平靜。

【夢境內容】

我發現自己站在一個陌生的城市街道上。我突然想到："這是夢！"我開始測試——我嘗試飛行，結果真的飛了起來！那種自由感難以形容。

【後續發展】

隨著練習，我學會了在清醒夢中保持冷靜，並開始探索夢境世界。我嘗試與夢中人物對話、改變夢境場景、甚至進行創造性問題解決。

【收穫與反思】

清醒夢讓我意識到意識本身的可塑性。它教會我在日常生活中也保持更多的覺知，並幫助我面對一些深層的恐懼。`,
    sources: [
      { title: "個人清醒夢體驗", author: "匿名", publication: "個人記錄", year: "2024", notes: "個人體驗記錄" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "33",
    title: "《三摩地》紀錄片",
    subtitle: "意識的終極狀態",
    category: "documentary" as ContentCategory,
    content: `【影片介紹】

《三摩地》（Samadhi）是一部探討冥想和意識狀態的紀錄片系列，由Daniel Schmidt執導。影片結合了古老的靈性智慧和現代科學研究，探討了人類意識的深層維度。

【主要內容】

影片探討了以下主題：
- 三摩地的本質：超越思維的意識狀態
- 自我與無我：個體意識的邊界
- 苦難的根源：執著與分離感
- 覺醒的道路：從分離到合一

【觀看建議】

這部紀錄片適合對冥想和靈性探索感興趣的觀眾。影片節奏緩慢，充滿哲學思考，建議在安靜的環境中觀看，並做好筆記。`,
    sources: [
      { title: "Samadhi Movie", author: "Schmidt, D.", publication: "YouTube/Official Website", year: "2017", url: "https://www.samadhimovie.com/" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "34",
    title: "《內在世界》紀錄片",
    subtitle: "冥想科學紀錄",
    category: "documentary" as ContentCategory,
    content: `【影片介紹】

《內在世界》（Inner Worlds, Outer Worlds）是一部探討意識、振動和宇宙本質的紀錄片系列，由Daniel Schmidt製作。影片結合了量子物理學、神經科學和古老靈性傳統。

【主要內容】

影片分為四部分：
1. 阿卡莎：探討宇宙的基本介質
2. 螺旋：生命和宇宙的幾何模式
3. 蛇與蓮花：意識的覺醒
4. 超越思維：超越概念的覺知

【科學與靈性】

影片訪談了多位科學家和靈性導師，探討了以下主題：
- 量子真空與阿卡莎場
- 振動與共振
- 神經可塑性與冥想
- 合一體驗的神經基礎`,
    sources: [
      { title: "Inner Worlds, Outer Worlds", author: "Schmidt, D.", publication: "YouTube", year: "2012", url: "https://www.youtube.com/watch?v=8LXb7x9c" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "35",
    title: "《生死與輪迴》紀錄片",
    subtitle: "前世今生的探索",
    category: "documentary" as ContentCategory,
    content: `【影片介紹】

《生死與輪迴》（Life After Life）是一部探討瀕死體驗和來世可能性的紀錄片。影片訪談了多位經歷過瀕死體驗的人，以及研究該領域的科學家。

【主要內容】

影片涵蓋了以下主題：
- 瀕死體驗的共同元素
- 科學對瀕死體驗的解釋
- 轉世研究的案例
- 對死亡的恐懼與接納

【科學觀點】

影片呈現了不同觀點，包括：
- Raymond Moody和Bruce Greyson的研究
- 神經科學對瀕死體驗的解釋
- 懷疑論者的批評
- 個人體驗的價值`,
    sources: [
      { title: "Life After Life Documentary", author: "Various", publication: "Various platforms", year: "Various", notes: "相關紀錄片" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "36",
    title: "冥想入門指南",
    subtitle: "初學者的冥想實踐手冊",
    category: "method" as ContentCategory,
    content: `【核心原理】

冥想是一種訓練注意力和覺知的技術，通過將注意力集中在特定對象（如呼吸、聲音或身體感受）上，培養專注和平靜的心態。

【實踐方法】

1. 選擇安靜的環境
找一個不會被打擾的地方，關閉手機或設為靜音。

2. 採取舒適的姿勢
可以坐在椅子上或墊子上，保持脊柱挺直但不僵硬。

3. 專注於呼吸
將注意力集中在呼吸的感覺上，感受空氣進出鼻孔或腹部的起伏。

4. 處理分心
當注意力被雜念帶走時，溫和地將注意力帶回呼吸，不要批評自己。

【建議練習時間】

初學者可以從每天5-10分鐘開始，逐漸增加到20-30分鐘。規律性比每次的時長更重要。`,
    sources: [
      { title: "Mindfulness in Plain English", author: "Gunaratana, B.", publication: "Wisdom Publications", year: "2002" },
      { title: "Wherever You Go, There You Are", author: "Kabat-Zinn, J.", publication: "Hyperion", year: "1994" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "37",
    title: "呼吸控制法",
    subtitle: "調息對意識狀態的影響",
    category: "method" as ContentCategory,
    content: `【核心原理】

呼吸是連結自主神經系統和意識的橋樑。通過有意識地調節呼吸，可以影響心率、血壓和情緒狀態，進而改變意識狀態。

【基本技術】

1. 腹式呼吸
吸氣時腹部鼓起，呼氣時腹部收縮。這種呼吸方式可以激活副交感神經系統，促進放鬆。

2. 4-7-8呼吸法
吸氣4秒，屏息7秒，呼氣8秒。這種呼吸模式可以快速減少焦慮。

3. 交替鼻孔呼吸
用一個鼻孔吸氣，另一個鼻孔呼氣，然後交替。這種技術可以平衡左右腦半球。

【注意事項】

- 不要強迫呼吸
- 如果感到頭暈或不適，停止練習
- 有呼吸系統疾病者應諮詢醫生`,
    sources: [
      { title: "Light on Pranayama", author: "Iyengar, B. K. S.", publication: "Crossroad", year: "1985" },
      { title: "The Science of Breath", author: "Rama, S.", publication: "Himalayan Institute", year: "1979" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "38",
    title: "正念修習法",
    subtitle: "當下覺知的培養",
    category: "method" as ContentCategory,
    content: `【核心原理】

正念（Mindfulness）是指對當下經驗的非評判性覺知。這一概念源自佛教傳統，但已被現代心理學和醫學廣泛採用。

【基本練習】

1. 身體掃描
從腳趾開始，逐步將注意力移動到身體的每個部位，觀察每個部位的感受。

2. 正念行走
在行走時，將注意力集中在腳步的感覺、身體的移動和周圍的環境。

3. 正念飲食
在進食時，專注於食物的味道、質地和氣味，以及身體的飽腹感。

【臨床應用】

正念已被用於治療多種疾病，包括：
- 焦慮症
- 抑鬱症
- 慢性疼痛
- 創傷後壓力症候群`,
    sources: [
      { title: "Full Catastrophe Living", author: "Kabat-Zinn, J.", publication: "Delta", year: "1990" },
      { title: "The Mindful Way Through Depression", author: "Williams, M. et al.", publication: "Guilford Press", year: "2007" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "39",
    title: "拙火定的修煉",
    subtitle: "藏密瑜伽的能量喚醒",
    category: "practice" as ContentCategory,
    content: `【修煉概述】

拙火定（Tummo）是藏傳佛教密宗的一種高級冥想技術，修行者聲稱能夠通過冥想產生體熱。這一技術被用於在寒冷環境中保持溫暖，以及促進靈性覺醒。

【修煉方法】

1. 基礎準備
學習正確的坐姿、呼吸法和視覺化技術。

2. 拙火冥想
觀想脊柱中央有一條能量通道，底部有一團火焰。通過呼吸和意念，將這股能量沿著脊柱上升。

3. 深化練習
隨著練習的深入，可以嘗試在寒冷環境中進行修煉。

【科學研究】

哈佛大學的研究表明，拙火定練習者可以顯著提高手指和腳趾的溫度，最高可達17°F的溫差。fMRI研究發現了獨特的腦活動模式。`,
    sources: [
      { title: "Neurocognitive and somatic components of temperature increases during g-Tummo meditation", author: "Kozhevnikov, M. et al.", publication: "PLoS One", year: "2013", url: "https://doi.org/10.1371/journal.pone.0058244" },
      { title: "The Tibetan Book of Living and Dying", author: "Rinpoche, S.", publication: "Harper San Francisco", year: "1992" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "40",
    title: "內丹術的實修",
    subtitle: "道家煉精化氣的方法",
    category: "practice" as ContentCategory,
    content: `【修煉概述】

內丹術是道家的一種修煉方法，以身體為爐鼎，通過煉精化氣、煉氣化神、煉神還虛三個階段，達到長生久視的目的。

【修煉階段】

1. 煉精化氣
通過特定的呼吸法和意念，將身體的精華轉化為氣（能量）。

2. 煉氣化神
將氣進一步提煉，與神（意識）結合。

3. 煉神還虛
超越形體，達到與道合一的境界。

【注意事項】

內丹術是一種深奧的修煉方法，應在有經驗的導師指導下進行。不當的練習可能導致身心問題。現代人應以開放但批判的態度對待這些傳統修煉。`,
    sources: [
      { title: "The Secret of the Golden Flower", author: "Unknown", publication: "Various translations", year: "~8th century" },
      { title: "Taoist Yoga", author: "Lu, K.", publication: "Weiser Books", year: "1970" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "41",
    title: "腦電波研究",
    subtitle: "EEG與意識狀態",
    category: "research" as ContentCategory,
    content: `【研究概述】

腦電圖（EEG）是一種記錄大腦電活動的非侵入性技術。不同頻率的腦波與不同的意識狀態相關，如清醒、放鬆、冥想和睡眠。

【腦波頻率】

- Delta波（0.5-4 Hz）：深度睡眠
- Theta波（4-8 Hz）：輕度睡眠、冥想
- Alpha波（8-13 Hz）：放鬆清醒
- Beta波（13-30 Hz）：專注思考
- Gamma波（30-100 Hz）：高級認知

【冥想研究】

研究表明，冥想與以下腦電變化相關：
- Alpha波功率增加（放鬆）
- Theta波功率增加（深度冥想）
- Gamma波功率增加（高級冥想狀態）
- 腦電相干性增加（腦區整合）`,
    sources: [
      { title: "EEG alpha and theta oscillations reflect cognitive and memory performance", author: "Klimesch, W.", publication: "Brain Research Reviews", year: "1999", url: "https://doi.org/10.1016/S0165-0173(98)00056-3" },
      { title: "Neuroelectric and imaging studies of meditation", author: "Cahn, B. R. & Polich, J.", publication: "Psychological Bulletin", year: "2006", url: "https://doi.org/10.1037/0033-2909.132.2.180" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "42",
    title: "腦成像研究",
    subtitle: "fMRI與冥想",
    category: "research" as ContentCategory,
    content: `【研究概述】

功能磁共振成像（fMRI）是一種測量大腦血流變化的技術，可以間接反映神經活動。fMRI已被廣泛用於研究冥想的神經機制。

【主要發現】

- 前額葉皮層激活增加（認知控制）
- 杏仁核激活減少（情緒調節）
- 後扣帶回/楔前葉激活減少（自我參照加工）
- 腦島激活增加（內感受覺知）

【長期效應】

結構MRI研究表明，長期冥想與以下變化相關：
- 海馬體灰質體積增加
- 杏仁核灰質體積減少
- 顳頂交界處灰質體積增加`,
    sources: [
      { title: "The underlying anatomical correlates of long-term meditation", author: "Luders, E. et al.", publication: "NeuroImage", year: "2013", url: "https://doi.org/10.1016/j.neuroimage.2012.09.061" },
      { title: "Meditation experience is associated with increased cortical thickness", author: "Lazar, S. W. et al.", publication: "Neuroreport", year: "2005", url: "https://doi.org/10.1097/01.wnr.0000186598.66243.19" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "43",
    title: "史前時代的薩滿",
    subtitle: "人類最早的靈性",
    category: "history" as ContentCategory,
    content: `【歷史概述】

薩滿教是人類最古老的靈性傳統之一，可以追溯到史前時代。考古證據表明，早在舊石器時代，人類就已經開始進行類似薩滿的儀式。

【考古證據】

- 洞穴壁畫：法國和西班牙的洞穴壁畫可能描繪了薩滿旅程
- 祭祀遺跡：古代祭祀場所的發現
- 藥用植物：古代人類使用致幻植物的證據
- 樂器：古代鼓和鈴鐺的發現

【共同特徵】

儘管世界各地的薩滿傳統各不相同，但它們有一些共同特徵：
- 進入改變意識狀態
- 與靈界溝通
- 治療和占卜
- 與自然力量的連結`,
    sources: [
      { title: "The Way of the Shaman", author: "Harner, M.", publication: "Harper & Row", year: "1980" },
      { title: "Shamanism: Archaic Techniques of Ecstasy", author: "Eliade, M.", publication: "Princeton University Press", year: "1964" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "44",
    title: "儒家文化",
    subtitle: "東亞的倫理傳統",
    category: "culture" as ContentCategory,
    content: `【文化概述】

儒家是中國最重要的哲學傳統之一，由孔子（公元前551-479年）創立。儒家強調仁、義、禮、智、信等德性，以及君臣、父子、夫婦等社會關係的和諧。

【核心概念】

- 仁：愛人，關懷他人
- 義：正當的行為
- 禮：社會規範和儀式
- 智：智慧和判斷力
- 信：誠信和信任

【修身方法】

儒家強調通過學習、反思和實踐來培養德性。主要方法包括：
- 讀經：學習古代經典
- 省身：每日反思自己的行為
- 踐履：將所學應用於實踐`,
    sources: [
      { title: "The Analects", author: "Confucius", publication: "Various translations", year: "~5th century BCE" },
      { title: "Confucianism: A Very Short Introduction", author: "Gardner, D. K.", publication: "Oxford University Press", year: "2014" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "45",
    title: "經典力學",
    subtitle: "牛頓的物理",
    category: "science" as ContentCategory,
    content: `【理論概述】

經典力學由艾薩克·牛頓在17世紀發展，是描述宏觀物體運動的物理理論。它包括運動定律和萬有引力定律，構成了現代工程學和天體力學的基礎。

【核心定律】

1. 慣性定律：物體保持靜止或等速運動，除非受到外力作用
2. F=ma：力等於質量乘以加速度
3. 作用力與反作用力：每個作用力都有一個大小相等、方向相反的反作用力

【與意識的關係】

經典力學是決定論的，即如果知道所有初始條件，就可以預測未來。這一觀點對自由意志和意識的討論有重要影響。量子力學的出現挑戰了嚴格的決定論。`,
    sources: [
      { title: "Philosophiæ Naturalis Principia Mathematica", author: "Newton, I.", publication: "Royal Society", year: "1687" },
      { title: "Classical Mechanics", author: "Goldstein, H.", publication: "Addison-Wesley", year: "1980" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "46",
    title: "生物學",
    subtitle: "生命的科學",
    category: "science" as ContentCategory,
    content: `【學科概述】

生物學是研究生命的科學，涵蓋從分子到生態系統的各個層次。現代生物學的核心是進化論和遺傳學，它們為理解生命的多樣性和統一性提供了框架。

【主要分支】

- 分子生物學：研究生物分子（DNA、蛋白質等）
- 細胞生物學：研究細胞結構和功能
- 生理學：研究器官和系統的功能
- 生態學：研究生物與環境的關係
- 進化生物學：研究物種的起源和變化

【與意識的關係】

神經生物學試圖從神經元的角度理解意識。雖然我們已經了解了很多關於大腦的知識，但意識的主觀體驗（感質）仍然是科學的難題。`,
    sources: [
      { title: "Molecular Biology of the Cell", author: "Alberts, B. et al.", publication: "Garland Science", year: "2015" },
      { title: "Principles of Neural Science", author: "Kandel, E. R. et al.", publication: "McGraw-Hill", year: "2013" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "47",
    title: "出體體驗",
    subtitle: "意識離開身體的經歷",
    category: "experience" as ContentCategory,
    content: `【個人經歷】

我第一次經歷出體體驗是在一次深度冥想後。我突然感覺自己漂浮在身體上方，能夠看到房間的各個角落，包括我躺在床上的身體。

【體驗內容】

我感覺自己非常輕盈，可以隨意移動。我嘗試穿過牆壁，結果真的穿過去了！我飛到了戶外，看到了夜空中的星星。那種自由感難以形容。

【回歸身體】

當我想要回歸時，我感覺自己被一股力量拉回身體。睜開眼睛後，我感覺既興奮又困惑。這次體驗讓我對意識的本質產生了深刻的疑問。

【反思】

雖然這次體驗感覺非常真實，但我不知道它是否真的是意識離開了身體，還是只是大腦產生的幻覺。無論如何，這次體驗改變了我對現實的看法。`,
    sources: [
      { title: "個人出體體驗記錄", author: "匿名", publication: "個人記錄", year: "2024", notes: "個人體驗記錄" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "48",
    title: "《星際之門》紀錄片",
    subtitle: "CIA解密計劃",
    category: "documentary" as ContentCategory,
    content: `【影片介紹】

《星際之門》（Stargate）相關紀錄片探討了美國情報機構從1972年到1995年進行的超心理學研究項目。這些項目主要研究遙視（Remote Viewing）——即不通過已知感官通道感知遠處目標的能力。

【主要內容】

- 星門計劃的歷史和發展
- 遙視技術的訓練方法
- 著名的遙視案例
- 項目的終止和評估

【科學評價】

雖然CIA最終終止了這些項目，但一些研究者認為遙視現象值得進一步研究。主流科學界對遙視持懷疑態度，認為現有的證據不足以支持其真實性。`,
    sources: [
      { title: "Remote Viewers: The Secret History of America's Psychic Spies", author: "Schnabel, J.", publication: "Dell", year: "1997" },
      { title: "CIA FOIA Documents on Stargate Project", author: "CIA", publication: "CIA", year: "1995", url: "https://www.cia.gov/readingroom/collection/stargate" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "49",
    title: "手印結合法",
    subtitle: "身體姿態與能量流動",
    category: "method" as ContentCategory,
    content: `【核心原理】

手印（Mudra）是瑜伽和印度傳統中的一種手勢，據說可以影響身體的能量流動和心理狀態。不同的手印與不同的意圖和效果相關。

【常見手印】

1. 禪那手印（Dhyana Mudra）
雙手放在膝上，右手在上，象徵冥想和內省。

2. 智慧手印（Jnana Mudra）
拇指和食指相觸，其他手指伸直，象徵智慧。

3. 無畏手印（Abhaya Mudra）
右手舉起，掌心向外，象徵保護和無畏。

【科學研究】

雖然手印的傳統解釋缺乏科學證據，但一些研究表明，特定的手勢可以影響腦活動和情緒狀態。這可能與手部在大腦皮層中的大代表區有關。`,
    sources: [
      { title: "Mudras: Yoga in Your Hands", author: "Hirschi, G.", publication: "Weiser Books", year: "2000" },
      { title: "The Science of Yoga", author: "Broad, W. J.", publication: "Simon & Schuster", year: "2012" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "50",
    title: "晨間冥想",
    subtitle: "早晨的冥想練習",
    category: "practice" as ContentCategory,
    content: `【修煉概述】

晨間冥想是一種在早晨進行的冥想練習，可以幫助設定一天的基調，增強專注力和覺知。許多冥想傳統都強調早晨練習的重要性。

【修煉方法】

1. 起床後
不要立即查看手機或電子郵件，先進行冥想。

2. 選擇姿勢
可以坐在床上或墊子上，保持脊柱挺直。

3. 設定意圖
在冥想開始前，設定一天的意圖或目標。

4. 冥想練習
進行10-20分鐘的冥想，可以是正念冥想、呼吸冥想或其他形式。

【益處】

- 增強專注力和清晰度
- 減少一天的壓力和焦慮
- 提高情緒穩定性
- 增強自我覺察`,
    sources: [
      { title: "The Miracle of Mindfulness", author: "Nhat Hanh, T.", publication: "Beacon Press", year: "1975" },
      { title: "Morning Meditation Guide", author: "Various", publication: "Various", year: "Various", notes: "冥想指導資料" }
    ],
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

const initialFeedback: Feedback[] = [];

// 論壇話題類型
interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: ForumReply[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  isPinned?: boolean;
}

interface ForumReply {
  id: string;
  content: string;
  author: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

const initialSubmissions: UserSubmission[] = [];
const initialForumTopics: ForumTopic[] = [
  {
    id: '1',
    title: '歡迎來到幽明錄討論區',
    content: '這裡是幽明錄的討論區，歡迎大家分享關於意識、冥想、靈性探索的想法和體驗。請保持友善和尊重的態度，共同創造一個良好的交流環境。',
    author: '系統管理員',
    category: 'general',
    replies: [],
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    isPinned: true
  }
];

export function useDataStore() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const storedContent = localStorage.getItem(STORAGE_KEY_CONTENT);
    const storedFeedback = localStorage.getItem(STORAGE_KEY_FEEDBACK);
    const storedSubmissions = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    const storedForum = localStorage.getItem(STORAGE_KEY_FORUM);

    if (storedVersion !== CURRENT_VERSION) {
      setContent(initialContent);
      setFeedback(initialFeedback);
      setSubmissions(initialSubmissions);
      setForumTopics(initialForumTopics);
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(initialContent));
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(initialFeedback));
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(initialSubmissions));
      localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(initialForumTopics));
      localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
    } else {
      if (storedContent) {
        try {
          setContent(JSON.parse(storedContent));
        } catch (e) {
          console.error('Failed to parse content:', e);
          setContent(initialContent);
        }
      } else {
        setContent(initialContent);
      }

      if (storedFeedback) {
        try {
          setFeedback(JSON.parse(storedFeedback));
        } catch (e) {
          console.error('Failed to parse feedback:', e);
          setFeedback(initialFeedback);
        }
      } else {
        setFeedback(initialFeedback);
      }

      if (storedSubmissions) {
        try {
          setSubmissions(JSON.parse(storedSubmissions));
        } catch (e) {
          console.error('Failed to parse submissions:', e);
          setSubmissions(initialSubmissions);
        }
      } else {
        setSubmissions(initialSubmissions);
      }

      if (storedForum) {
        try {
          setForumTopics(JSON.parse(storedForum));
        } catch (e) {
          console.error('Failed to parse forum:', e);
          setForumTopics(initialForumTopics);
        }
      } else {
        setForumTopics(initialForumTopics);
      }
    }

    setIsLoaded(true);
  }, []);

  const saveContent = useCallback((newContent: ContentItem[]) => {
    setContent(newContent);
    localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(newContent));
  }, []);

  const addContent = useCallback((item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...content, newItem];
    saveContent(updated);
  }, [content, saveContent]);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    const updated = content.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : item
    );
    saveContent(updated);
  }, [content, saveContent]);

  const deleteContent = useCallback((id: string) => {
    const updated = content.filter(item => item.id !== id);
    saveContent(updated);
  }, [content, saveContent]);

  const getContentById = useCallback((id: string) => {
    return content.find(item => item.id === id);
  }, [content]);

  const getAllContent = useCallback(() => {
    return content;
  }, [content]);

  const getRelatedContent = useCallback((item: ContentItem) => {
    const relatedIds = [
      ...(item.relatedMethods || []),
      ...(item.relatedTheories || []),
      ...(item.relatedEvidence || [])
    ];
    return content.filter(c => relatedIds.includes(c.id) && c.id !== item.id);
  }, [content]);

  const addFeedback = useCallback((feedbackData: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [...feedback, newFeedback];
    setFeedback(updated);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
  }, [feedback]);

  const replyFeedback = useCallback((id: string, reply: string) => {
    const updated = feedback.map(item => 
      item.id === id ? { ...item, reply, status: 'replied' as const } : item
    );
    setFeedback(updated);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
  }, [feedback]);

  const getAllFeedback = useCallback(() => {
    return feedback;
  }, [feedback]);

  const deleteFeedback = useCallback((id: string) => {
    const updated = feedback.filter(item => item.id !== id);
    setFeedback(updated);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
  }, [feedback]);

  const importContent = useCallback((items: ContentItem[]) => {
    const updated = [...content, ...items];
    saveContent(updated);
  }, [content, saveContent]);

  // 投稿相關函數
  const addSubmission = useCallback((submission: {
    title: string;
    subtitle: string;
    category: ContentCategory;
    content: string;
    sources: Source[];
    tags: string[];
    submitterName: string;
    submitterEmail: string;
  }) => {
    const newSubmission: UserSubmission = {
      ...submission,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [...submissions, newSubmission];
    setSubmissions(updated);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  }, [submissions]);

  const approveSubmission = useCallback((submissionId: string, adminNote?: string) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    // 將投稿轉為正式內容
    const newContent: ContentItem = {
      id: Date.now().toString(),
      title: submission.title,
      subtitle: submission.subtitle,
      category: submission.category,
      content: submission.content,
      sources: submission.sources,
      tags: submission.tags,
      status: 'published',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    const updatedContent = [...content, newContent];
    saveContent(updatedContent);

    // 更新投稿狀態
    const updatedSubmissions = submissions.map(s =>
      s.id === submissionId ? { ...s, status: 'approved' as const, adminNote, reviewedAt: new Date().toISOString() } : s
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updatedSubmissions));
  }, [submissions, content, saveContent]);

  const rejectSubmission = useCallback((submissionId: string, adminNote?: string) => {
    const updated = submissions.map(s =>
      s.id === submissionId ? { ...s, status: 'rejected' as const, adminNote, reviewedAt: new Date().toISOString() } : s
    );
    setSubmissions(updated);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  }, [submissions]);

  const getSubmissions = useCallback(() => {
    return submissions;
  }, [submissions]);

  // 論壇相關函數
  const addForumTopic = useCallback((topic: {
    title: string;
    content: string;
    author: string;
    category: string;
  }) => {
    const newTopic: ForumTopic = {
      ...topic,
      id: Date.now().toString(),
      replies: [],
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...forumTopics, newTopic];
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  const addForumReply = useCallback((topicId: string, content: string, author: string) => {
    const reply: ForumReply = {
      id: Date.now().toString(),
      content,
      author,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    };
    const updated = forumTopics.map(t =>
      t.id === topicId ? { ...t, replies: [...t.replies, reply] } : t
    );
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  const likeForumTopic = useCallback((topicId: string, userId: string) => {
    const updated = forumTopics.map(t => {
      if (t.id === topicId) {
        if (t.likedBy.includes(userId)) {
          return { ...t, likes: t.likes - 1, likedBy: t.likedBy.filter(id => id !== userId) };
        }
        return { ...t, likes: t.likes + 1, likedBy: [...t.likedBy, userId] };
      }
      return t;
    });
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  const likeForumReply = useCallback((topicId: string, replyId: string, userId: string) => {
    const updated = forumTopics.map(t => {
      if (t.id === topicId) {
        const updatedReplies = t.replies.map(r => {
          if (r.id === replyId) {
            if (r.likedBy.includes(userId)) {
              return { ...r, likes: r.likes - 1, likedBy: r.likedBy.filter(id => id !== userId) };
            }
            return { ...r, likes: r.likes + 1, likedBy: [...r.likedBy, userId] };
          }
          return r;
        });
        return { ...t, replies: updatedReplies };
      }
      return t;
    });
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  const getForumTopics = useCallback(() => {
    return forumTopics;
  }, [forumTopics]);

  const pinForumTopic = useCallback((topicId: string, isPinned: boolean) => {
    const updated = forumTopics.map(t =>
      t.id === topicId ? { ...t, isPinned } : t
    );
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  const deleteForumTopic = useCallback((topicId: string) => {
    const updated = forumTopics.filter(t => t.id !== topicId);
    setForumTopics(updated);
    localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(updated));
  }, [forumTopics]);

  return {
    isLoaded,
    content,
    feedback,
    submissions,
    forumTopics,
    addContent,
    updateContent,
    deleteContent,
    getContentById,
    getAllContent,
    getRelatedContent,
    addFeedback,
    replyFeedback,
    getAllFeedback,
    deleteFeedback,
    importContent,
    addSubmission,
    approveSubmission,
    rejectSubmission,
    getSubmissions,
    addForumTopic,
    addForumReply,
    likeForumTopic,
    likeForumReply,
    getForumTopics,
    pinForumTopic,
    deleteForumTopic,
  };
}
