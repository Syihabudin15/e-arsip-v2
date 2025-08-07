import {
  JenisPemohon,
  PermohonanKredit,
  Role,
  User,
  Document,
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
}

interface IDocument extends Document {
  User: User;
}
export interface IPermohonanKredit extends PermohonanKredit {
  JenisPemohon: JenisPemohon;
  Document: IDocument;
}

export interface IFileList {
  name: string;
  file: string;
}

export interface IDescription {
  date: string;
  desc: string;
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
