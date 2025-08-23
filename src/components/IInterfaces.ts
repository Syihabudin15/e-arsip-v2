import {
  JenisPemohon,
  Role,
  User,
  PermohonanAction,
  RootFiles,
  Files,
  Permohonan,
  Pemohon,
  Produk,
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
  optionLength?: number;
  onSearch?: Function;
}
export interface IFiles extends Files {
  PermohonanAction: PermohonanAction[];
  RootFiles: RootFiles;
}
export interface IRootFiles extends RootFiles {
  Files: IFiles[];
}

export interface IPemohon extends Pemohon {
  Permohonan: IPermohonan[];
  JenisPemohon: JenisPemohon;
}
export interface IPemohonForPermohonan extends Pemohon {
  JenisPemohon: JenisPemohon;
}
export interface IPermohonan extends Permohonan {
  RootFiles: IRootFiles[];
  Produk: Produk;
  User: User;
  Pemohon: IPemohonForPermohonan;
}
interface FilesPA extends Files {
  Permohonan: Permohonan;
  RootFiles?: RootFiles;
}
interface IRootFilesPA extends RootFiles {
  Files: FilesPA[];
}
export interface IPermohonanAction extends PermohonanAction {
  RootFiles: IRootFilesPA[];
  Requester: User;
  Approver: User | null;
  Permohonan: IPermohonan;
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
