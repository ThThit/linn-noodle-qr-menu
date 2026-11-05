import type { Language } from "./ownerCopy"

/** Printed on every card and tent in all three languages, whatever the UI language. */
export const scanToOrder = {
  my: "အော်ဒါမှာရန် စကင်ဖတ်ပါ",
  en: "Scan to order",
  zh: "扫码点餐",
}

export const scanToViewMenu = {
  my: "မီနူးကြည့်ရန်နှင့် အော်ဒါမှာရန် စကင်ဖတ်ပါ",
  en: "Scan to view menu & order",
  zh: "扫码查看菜单并点餐",
}

export const tableWords = { my: "စားပွဲ", en: "Table", zh: "桌号" }

type QrCopy = {
  title: string
  helper: string
  numberOfTables: string
  fewer: string
  more: string
  generate: string
  generateHint: string
  emptyTitle: string
  emptyText: string
  download: string
  print: string
  regenerate: string
  downloadAll: string
  printAll: string
  codesReady: (count: number) => string
  regenerated: (table: string) => string
  downloaded: (table: string) => string
  pdfHint: string
  previewTitle: string
  previewSub: (count: number) => string
  cancel: string
  foldHere: string
  close: string
}

export const qrCopy: Record<Language, QrCopy> = {
  en: {
    title: "Table QR Codes",
    helper:
      "Each table has its own QR code. Customers scan it to open the menu for that table.",
    numberOfTables: "Number of tables",
    fewer: "One table fewer",
    more: "One table more",
    generate: "Generate QR Codes",
    generateHint: "Makes one QR code for every table.",
    emptyTitle: "No QR codes yet",
    emptyText:
      "Choose how many tables you have, then press “Generate QR Codes”.",
    download: "Download",
    print: "Print",
    regenerate: "Regenerate",
    downloadAll: "Download All (PDF)",
    printAll: "Print All",
    codesReady: (count) => `${count} QR codes are ready`,
    regenerated: (table) =>
      `New QR code made for Table ${table}. Please print it again.`,
    downloaded: (table) => `Saved the QR code for Table ${table}`,
    pdfHint: "In the print window, choose “Save as PDF”.",
    previewTitle: "Print Preview",
    previewSub: (count) =>
      count === 1
        ? "Table tent card. Fold along the dashed line."
        : `${count} table tent cards, one per page. Fold along the dashed line.`,
    cancel: "Cancel",
    foldHere: "Fold here",
    close: "Close",
  },
  my: {
    title: "စားပွဲ QR ကုဒ်များ",
    helper:
      "စားပွဲတစ်ခုစီတွင် ကိုယ်ပိုင် QR ကုဒ် ရှိသည်။ ဖောက်သည်များ စကင်ဖတ်ပြီး ထိုစားပွဲအတွက် မီနူးကို ဖွင့်နိုင်သည်။",
    numberOfTables: "စားပွဲ အရေအတွက်",
    fewer: "စားပွဲ တစ်ခု လျှော့ရန်",
    more: "စားပွဲ တစ်ခု တိုးရန်",
    generate: "QR ကုဒ်များ ထုတ်မည်",
    generateHint: "စားပွဲတိုင်းအတွက် QR ကုဒ်တစ်ခုစီ ပြုလုပ်ပေးသည်။",
    emptyTitle: "QR ကုဒ် မရှိသေးပါ",
    emptyText:
      "စားပွဲ အရေအတွက်ကို ရွေးပြီး “QR ကုဒ်များ ထုတ်မည်” ကို နှိပ်ပါ။",
    download: "ဒေါင်းလုဒ်",
    print: "ပရင့်ထုတ်",
    regenerate: "အသစ်ပြန်ထုတ်",
    downloadAll: "အားလုံး ဒေါင်းလုဒ် (PDF)",
    printAll: "အားလုံး ပရင့်ထုတ်",
    codesReady: (count) => `QR ကုဒ် ${count} ခု အသင့်ဖြစ်ပါပြီ`,
    regenerated: (table) =>
      `စားပွဲ ${table} အတွက် QR ကုဒ်အသစ် ထုတ်ပြီးပါပြီ။ ပြန်လည် ပရင့်ထုတ်ပါ။`,
    downloaded: (table) => `စားပွဲ ${table} QR ကုဒ်ကို သိမ်းပြီးပါပြီ`,
    pdfHint: "ပရင့် ဝင်းဒိုးတွင် “Save as PDF” ကို ရွေးပါ။",
    previewTitle: "ပရင့် အစမ်းကြည့်ရန်",
    previewSub: (count) =>
      count === 1
        ? "စားပွဲတင်ကတ်။ အစက်ချမျဉ်းအတိုင်း ခေါက်ပါ။"
        : `စားပွဲတင်ကတ် ${count} ခု၊ တစ်မျက်နှာလျှင် တစ်ခု။ အစက်ချမျဉ်းအတိုင်း ခေါက်ပါ။`,
    cancel: "မလုပ်တော့ပါ",
    foldHere: "ဤနေရာတွင် ခေါက်ပါ",
    close: "ပိတ်ရန်",
  },
  zh: {
    title: "餐桌二维码",
    helper: "每张餐桌都有自己的二维码。顾客扫码即可打开该餐桌的菜单。",
    numberOfTables: "餐桌数量",
    fewer: "减少一张餐桌",
    more: "增加一张餐桌",
    generate: "生成二维码",
    generateHint: "为每张餐桌生成一个二维码。",
    emptyTitle: "还没有二维码",
    emptyText: "选择餐桌数量，然后点击“生成二维码”。",
    download: "下载",
    print: "打印",
    regenerate: "重新生成",
    downloadAll: "全部下载 (PDF)",
    printAll: "全部打印",
    codesReady: (count) => `已生成 ${count} 个二维码`,
    regenerated: (table) => `${table} 号桌的新二维码已生成，请重新打印。`,
    downloaded: (table) => `已保存 ${table} 号桌二维码`,
    pdfHint: "在打印窗口中选择“另存为 PDF”。",
    previewTitle: "打印预览",
    previewSub: (count) =>
      count === 1
        ? "桌牌。沿虚线对折。"
        : `${count} 张桌牌，每页一张。沿虚线对折。`,
    cancel: "取消",
    foldHere: "在此对折",
    close: "关闭",
  },
}
