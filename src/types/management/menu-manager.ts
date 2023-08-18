import { QueryAdditionalFields, UpdateAdditionalFields } from '../global';

interface Menu extends QueryAdditionalFields {
  title: string;
  icon: string;
  parent: number;
  is_parent: boolean;
  hidden: boolean;
}

interface CreateMenu {
  title: string;
  parent: number;
  icon?: string;
  hidden?: boolean;
}

interface treeMenuNode {
  id: number;
  title: string;
  isParent: boolean;
  open: boolean;
  parent: number;
  hidden: boolean;
  icon?: string;
  level?: number;
  status?: string;
  create_time?: string;
  update_time?: string;
  children?: treeMenuNode[];
  $isChildTableOpen?: boolean;
}

interface UpdateMenu extends Partial<CreateMenu>, UpdateAdditionalFields {}

export { Menu, CreateMenu, UpdateMenu, treeMenuNode };
