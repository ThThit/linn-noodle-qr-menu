import type { Language } from "../shared/menuStore"

type MenuCopy = {
  title: string
  helper: string
  addItem: string
  addCategory: string
  seeCustomerMenu: string
  columns: {
    photo: string
    name: string
    price: string
    category: string
    available: string
    actions: string
  }
  available: string
  soldOut: string
  edit: string
  delete: string
  itemsCount: (count: number) => string
  soldOutCount: (count: number) => string
  emptyCategory: string
  panelAdd: string
  panelEdit: string
  photo: string
  dropTitle: string
  dropOr: string
  dropActive: string
  changePhoto: string
  removePhoto: string
  photoError: string
  itemName: string
  description: string
  languageLabels: Record<Language, string>
  namePlaceholder: Record<Language, string>
  descPlaceholder: string
  price: string
  category: string
  availability: string
  availableHint: string
  soldOutHint: string
  save: string
  cancel: string
  close: string
  nameRequired: string
  priceRequired: string
  deleteTitle: string
  deleteQuestion: string
  deleteNote: string
  deleteYes: string
  added: (name: string) => string
  saved: (name: string) => string
  deleted: (name: string) => string
  nowSoldOut: (name: string) => string
  nowAvailable: (name: string) => string
  categoryTitle: string
  categoryHelper: string
  categoryAdd: string
  categoryAdded: (name: string) => string
}

export const menuCopy: Record<Language, MenuCopy> = {
  en: {
    title: "Menu Manager",
    helper:
      "Add, change or hide dishes. Changes show on the customer menu straight away.",
    addItem: "Add New Item",
    addCategory: "Add Category",
    seeCustomerMenu: "See customer menu",
    columns: {
      photo: "Photo",
      name: "Name",
      price: "Price",
      category: "Category",
      available: "Available",
      actions: "Change",
    },
    available: "Available",
    soldOut: "Sold out",
    edit: "Edit",
    delete: "Delete",
    itemsCount: (count) => `${count} ${count === 1 ? "dish" : "dishes"}`,
    soldOutCount: (count) => `${count} sold out`,
    emptyCategory: "No dishes in this category yet.",
    panelAdd: "Add New Item",
    panelEdit: "Edit Item",
    photo: "Photo",
    dropTitle: "Drag a photo here",
    dropOr: "or click to choose one",
    dropActive: "Drop the photo to use it",
    changePhoto: "Change photo",
    removePhoto: "Remove",
    photoError: "Please choose a picture file (JPG or PNG).",
    itemName: "Item name",
    description: "Description",
    languageLabels: {
      my: "Burmese · မြန်မာ",
      en: "English",
      zh: "Chinese · 中文",
    },
    namePlaceholder: {
      my: "ဥပမာ - ရှမ်းခေါက်ဆွဲ",
      en: "e.g. Shan Noodle",
      zh: "例如：掸邦面",
    },
    descPlaceholder: "A short line about the dish",
    price: "Price (฿)",
    category: "Category",
    availability: "Can customers order it?",
    availableHint: "Customers can order this dish.",
    soldOutHint: "Customers see “Sold out” and cannot order it.",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    nameRequired: "Please type a name in at least one language.",
    priceRequired: "Please type a price above 0.",
    deleteTitle: "Delete this item?",
    deleteQuestion: "Are you sure you want to delete this item?",
    deleteNote:
      "It will be removed from the customer menu. This cannot be undone.",
    deleteYes: "Yes, delete",
    added: (name) => `${name} was added to the menu`,
    saved: (name) => `Changes to ${name} saved`,
    deleted: (name) => `${name} was deleted`,
    nowSoldOut: (name) => `${name} now shows as Sold out to customers`,
    nowAvailable: (name) => `${name} is available again`,
    categoryTitle: "Add Category",
    categoryHelper: "Type the category name. English is enough to start.",
    categoryAdd: "Add Category",
    categoryAdded: (name) => `${name} category added`,
  },
  my: {
    title: "မီနူး စီမံရန်",
    helper:
      "ဟင်းလျာများကို ထည့်ရန်၊ ပြင်ရန် သို့မဟုတ် ဖျောက်ရန်။ ပြောင်းလဲမှုများ ဖောက်သည် မီနူးတွင် ချက်ချင်း ပေါ်ပါမည်။",
    addItem: "ဟင်းလျာအသစ် ထည့်ရန်",
    addCategory: "အမျိုးအစား ထည့်ရန်",
    seeCustomerMenu: "ဖောက်သည် မီနူး ကြည့်ရန်",
    columns: {
      photo: "ဓာတ်ပုံ",
      name: "အမည်",
      price: "ဈေးနှုန်း",
      category: "အမျိုးအစား",
      available: "ရနိုင်မှု",
      actions: "ပြင်ဆင်ရန်",
    },
    available: "ရနိုင်သည်",
    soldOut: "ကုန်သွားပြီ",
    edit: "ပြင်ရန်",
    delete: "ဖျက်ရန်",
    itemsCount: (count) => `ဟင်းလျာ ${count} ခု`,
    soldOutCount: (count) => `${count} ခု ကုန်သွားပြီ`,
    emptyCategory: "ဤအမျိုးအစားတွင် ဟင်းလျာ မရှိသေးပါ။",
    panelAdd: "ဟင်းလျာအသစ် ထည့်ရန်",
    panelEdit: "ဟင်းလျာ ပြင်ရန်",
    photo: "ဓာတ်ပုံ",
    dropTitle: "ဓာတ်ပုံကို ဤနေရာသို့ ဆွဲထည့်ပါ",
    dropOr: "သို့မဟုတ် နှိပ်ပြီး ရွေးပါ",
    dropActive: "ဓာတ်ပုံကို လွှတ်ချပါ",
    changePhoto: "ဓာတ်ပုံ ပြောင်းရန်",
    removePhoto: "ဖယ်ရှားရန်",
    photoError: "ဓာတ်ပုံဖိုင် (JPG သို့မဟုတ် PNG) ကို ရွေးပါ။",
    itemName: "ဟင်းလျာ အမည်",
    description: "ဖော်ပြချက်",
    languageLabels: {
      my: "မြန်မာ",
      en: "အင်္ဂလိပ် · English",
      zh: "တရုတ် · 中文",
    },
    namePlaceholder: {
      my: "ဥပမာ - ရှမ်းခေါက်ဆွဲ",
      en: "e.g. Shan Noodle",
      zh: "例如：掸邦面",
    },
    descPlaceholder: "ဟင်းလျာအကြောင်း အတိုချုပ်",
    price: "ဈေးနှုန်း (฿)",
    category: "အမျိုးအစား",
    availability: "ဖောက်သည်များ မှာယူနိုင်ပါသလား?",
    availableHint: "ဖောက်သည်များ ဤဟင်းလျာကို မှာယူနိုင်သည်။",
    soldOutHint: "ဖောက်သည်များ “ကုန်သွားပြီ” ဟု မြင်ရပြီး မှာယူ၍ မရပါ။",
    save: "သိမ်းမည်",
    cancel: "မလုပ်တော့ပါ",
    close: "ပိတ်ရန်",
    nameRequired: "အမည်ကို အနည်းဆုံး ဘာသာစကား တစ်ခုဖြင့် ရိုက်ထည့်ပါ။",
    priceRequired: "0 ထက်ကြီးသော ဈေးနှုန်း ထည့်ပါ။",
    deleteTitle: "ဤဟင်းလျာကို ဖျက်မလား?",
    deleteQuestion: "ဤဟင်းလျာကို ဖျက်ရန် သေချာပါသလား?",
    deleteNote: "ဖောက်သည် မီနူးမှ ဖယ်ရှားသွားမည်ဖြစ်ပြီး ပြန်ယူ၍ မရပါ။",
    deleteYes: "ဟုတ်ကဲ့၊ ဖျက်မည်",
    added: (name) => `${name} ကို မီနူးထဲ ထည့်ပြီးပါပြီ`,
    saved: (name) => `${name} ပြင်ဆင်မှုကို သိမ်းပြီးပါပြီ`,
    deleted: (name) => `${name} ကို ဖျက်ပြီးပါပြီ`,
    nowSoldOut: (name) => `${name} ကို ဖောက်သည်များအား ကုန်သွားပြီဟု ပြပါမည်`,
    nowAvailable: (name) => `${name} ကို ပြန်မှာယူနိုင်ပါပြီ`,
    categoryTitle: "အမျိုးအစား ထည့်ရန်",
    categoryHelper: "အမျိုးအစား အမည်ကို ရိုက်ထည့်ပါ။ ဘာသာစကား တစ်ခုဖြင့် စတင်နိုင်သည်။",
    categoryAdd: "ထည့်မည်",
    categoryAdded: (name) => `${name} အမျိုးအစား ထည့်ပြီးပါပြီ`,
  },
  zh: {
    title: "菜单管理",
    helper: "添加、修改或隐藏菜品。修改会立即显示在顾客菜单上。",
    addItem: "添加新菜品",
    addCategory: "添加分类",
    seeCustomerMenu: "查看顾客菜单",
    columns: {
      photo: "图片",
      name: "名称",
      price: "价格",
      category: "分类",
      available: "供应",
      actions: "操作",
    },
    available: "有货",
    soldOut: "售罄",
    edit: "编辑",
    delete: "删除",
    itemsCount: (count) => `${count} 道菜`,
    soldOutCount: (count) => `${count} 道售罄`,
    emptyCategory: "此分类还没有菜品。",
    panelAdd: "添加新菜品",
    panelEdit: "编辑菜品",
    photo: "图片",
    dropTitle: "将图片拖到这里",
    dropOr: "或点击选择图片",
    dropActive: "松开即可使用这张图片",
    changePhoto: "更换图片",
    removePhoto: "移除",
    photoError: "请选择图片文件（JPG 或 PNG）。",
    itemName: "菜品名称",
    description: "描述",
    languageLabels: {
      my: "缅甸语 · မြန်မာ",
      en: "英语 · English",
      zh: "中文",
    },
    namePlaceholder: {
      my: "ဥပမာ - ရှမ်းခေါက်ဆွဲ",
      en: "e.g. Shan Noodle",
      zh: "例如：掸邦面",
    },
    descPlaceholder: "简单介绍这道菜",
    price: "价格 (฿)",
    category: "分类",
    availability: "顾客可以点这道菜吗？",
    availableHint: "顾客可以点这道菜。",
    soldOutHint: "顾客会看到“售罄”，无法点单。",
    save: "保存",
    cancel: "取消",
    close: "关闭",
    nameRequired: "请至少用一种语言填写名称。",
    priceRequired: "请输入大于 0 的价格。",
    deleteTitle: "删除这道菜？",
    deleteQuestion: "确定要删除这道菜吗？",
    deleteNote: "它将从顾客菜单中移除，且无法恢复。",
    deleteYes: "确定删除",
    added: (name) => `已将「${name}」添加到菜单`,
    saved: (name) => `已保存「${name}」的修改`,
    deleted: (name) => `已删除「${name}」`,
    nowSoldOut: (name) => `「${name}」现在对顾客显示为售罄`,
    nowAvailable: (name) => `「${name}」已恢复供应`,
    categoryTitle: "添加分类",
    categoryHelper: "请输入分类名称，填写一种语言即可。",
    categoryAdd: "添加",
    categoryAdded: (name) => `已添加分类「${name}」`,
  },
}
