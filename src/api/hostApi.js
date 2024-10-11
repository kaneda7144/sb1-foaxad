import axios from 'axios';

const SPREADSHEET_ID = '1t6ieY-TdOPHsxOvsOyOE-nDp4985BDkz66E5VvWeJ-Y';

export const fetchHostData = async () => {
  try {
    const response = await axios.get(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`
    );
    
    // CSVデータを解析してホストデータに変換
    const rows = response.data.split('\n').map(row => 
      row.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1'))
    );
    
    const hosts = rows.slice(1)
      .filter(row => row.length >= 4 && row[2] === '1') // C列が1の場合のみフィルタリング
      .map(row => ({
        id: row[0],
        name: row[1],
        iconUrl: extractImageUrl(row[3]), // D列からアイコンURLを抽出
        viewers: parseInt(row[3], 10) || 0,
        streamUrl: '', // 現在のデータにはないため空文字列を設定
        clubName: '', // 現在のデータにはないため空文字列を設定
        clubUrl: '', // 現在のデータにはないため空文字列を設定
        tags: [] // 現在のデータにはないため空の配列を設定
      }))
      .filter(host => !isNaN(host.viewers)) // 視聴者数が数値でない場合を除外
      .sort((a, b) => b.viewers - a.viewers); // リスナー数の降順でソート

    console.log('Fetched hosts:', hosts); // デバッグ用ログ
    return hosts;
  } catch (error) {
    console.error('Error fetching host data:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return [];
  }
};

// IMAGE関数からURLを抽出する関数
function extractImageUrl(cellContent) {
  const match = cellContent.match(/=IMAGE\("([^"]+)"/);
  return match ? match[1] : '';
}