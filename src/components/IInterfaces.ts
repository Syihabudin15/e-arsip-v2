import {
  JenisPemohon,
  PermohonanKredit,
  Role,
  User,
  Document,
  PermohonanAction,
} from "@prisma/client";

export interface IUser extends User {
  role: Role;
}

export interface IPermission {
  path: string;
  access: string[];
}

export interface IFormInput {
  label: string;
  value: any;
  onChange?: Function;
  required?: boolean;
  placeholder?: any;
  type?: "area" | "number" | "date" | "password" | "option";
  width?: number | string;
  align?: "row" | "col";
  disable?: boolean;
  hide?: boolean;
  options?: { label: any; value: any }[];
  optionsMode?: "tags" | "multiple";
}
interface IDocument extends Document {
  PermohonanAction: PermohonanAction[];
}
export interface IPermohonanKredit extends PermohonanKredit {
  JenisPemohon: JenisPemohon;
  Document: IDocument;
  User: User;
}

export interface IFileList {
  allowedDownload: string;
  name: string;
  file: string;
}

export interface IDescription {
  date: string;
  userId: number;
  fullname: string;
  prevValue: any;
  lastValue: any;
}

export interface IMenu {
  path: string;
  name: string;
  access: string[];
}

export interface WithAccessOptions {
  path: string; // path yang mau dicek
  required?: string[]; // izin yang diperlukan, default: []
  redirectTo?: string; // kemana redirect kalau tidak punya akses
}

export interface EditActivity {
  time: string;
  desc: string;
}

export interface IExcelColumn {
  header: string;
  key: string;
  width?: number;
}
export interface IExcelData {
  [key: string]: any;
}
