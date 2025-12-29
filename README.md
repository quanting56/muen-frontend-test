# Analytics Modal（Hopes Patient Journey）

本專案為前端測驗作品，依照 Figma 設計稿實作「病患檢驗數據 Analytics」的 Modal 介面，包含 **表格模式（Table）** 與 **圖表模式（Chart）** 切換、趨勢縮圖（sparkline）、異常值標記與時間範圍篩選等功能。

---

## Demo

部署於 GitHub Pages：https://quanting56.github.io/muen-frontend-test/

---

## 功能完成項目

### Modal（遮罩視窗）
- 主頁點擊「打開遮罩」開啟 Modal
- 點擊右上角 ✕ 關閉 Modal
- Modal 內含標題、日期範圍選擇器、Chart/Table 切換、資料表格

### Table 模式（表格檢視）
- 以日期為欄、以檢驗項目為列顯示數據
- 無資料的格子顯示 `—`
- 依 abnormal 狀態上色（範例）
  - 正常：綠底
  - Low（L）：紅底
  - High（H）：橘底
- 表格最下方顯示日期列（可依需求 sticky 於底部）

### Chart 模式（圖表檢視）
- 每列顯示數值點（normal 圓點 / L 向下三角 / H 向上三角）
- 右側放大鏡（🔍）可展開該列，顯示折線趨勢（相鄰點連線）
- 展開時會顯示更完整的 y 軸縮放與日期標籤（M/D）

### Trend Sparkline（趨勢縮圖）
- 每個檢驗項目在 Trend 欄位顯示簡易折線縮圖
- 由該 lab 的 records 轉為數值序列繪製

### 日期範圍選擇（DateRangePicker）
- 標題旁提供日期範圍選擇器（顯示區間 label + mini timeline）
- 點擊可開啟 popover：
  - Presets：Past 1 month / 6 months / 1 year / 3 years
  - Start date：選起始日期
  - End date：Today（資料集最新）或自訂日期（或 month after，視版本）
- 會依日期範圍動態更新表格/圖表的日期欄位

---

## 專案技術

- Vue 3 + Vite（Composition API / SFC）
- TailwindCSS
- 資料來源：本地 mock JSON（`src/data/mock_data.json`）

---

## 專案結構

```text
src/  

components/  
- DateRangePicker.vue # 日期區間選擇器（label + timeline + popover）  
- ModeToggle.vue # Chart / Table 切換  
- Sparkline.vue # Trend 欄位小折線  
- LabTable.vue # Table 模式每列的日期欄位渲染  
- LabChartList.vue # Chart 模式：點位 + 展開折線  

data/  
- mock_data.json # 測試資料  

utils/  
- labs.js # 日期彙整、records map、series 轉換等 helper  

App.vue # 主頁/Modal 組裝
```
