import {
  JenisPemohon,
  PermohonanKredit,
  Role,
  User,
  PermohonanAction,
  RootFiles,
  Files,
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
export interface IFiles extends Files {
  PermohonanAction: PermohonanAction[];
  RootFiles: RootFiles;
}
export interface IRootFiles extends RootFiles {
  Files: IFiles[];
}

export interface IPermohonanKredit extends PermohonanKredit {
  JenisPemohon: JenisPemohon;
  RootFiles: IRootFiles[];
  User: User;
}
interface FilesPA extends Files {
  PermohonanKredit: PermohonanKredit;
}
interface IRootFilesPA extends RootFiles {
  Files: FilesPA[];
}
export interface IPermohonanAction extends PermohonanAction {
  RootFiles: IRootFilesPA[];
  Requester: User;
  Approver: User | null;
  PermohonanKredit: PermohonanKredit;
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
  desc: string;
  time: string;
}
export interface IDescription {
  time: string;
  user: string;
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
