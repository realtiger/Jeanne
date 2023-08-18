import { LayoutConfig } from '../../types/global';

const SIDEBAR_FOLD_WIDTH = 60;
const SIDEBAR_OPEN_WIDTH = 240;

const HEADER_FOLD_HEIGHT = 40;
const HEADER_OPEN_HEIGHT = 60;

const FOOTER_HEIGHT = 60;

const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  id: 'default',
  mode: 'sidebarTop',
  header: {
    fixed: false,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: false,
      height: HEADER_OPEN_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: false,
    shrink: false,
    hidden: false,
    zIndex: null,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    }
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

const WATERFALL_LAYOUT_CONFIG: LayoutConfig = {
  id: 'waterfall',
  mode: 'sidebarTop',
  header: {
    fixed: false,
    hidden: true,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: false,
      height: HEADER_OPEN_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: true,
    shrink: false,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_FOLD_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    hidden: false,
    zIndex: null
  },
  footer: {
    hidden: false,
    height: 60
  },
  hideLogo: false
};

const WIDE_LAYOUT_CONFIG: LayoutConfig = {
  id: 'wide',
  mode: 'sidebarTop',
  header: {
    fixed: true,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_FOLD_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: false,
      height: HEADER_FOLD_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: false,
    shrink: false,
    hidden: true,
    zIndex: null,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    }
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

const COMMON_LAYOUT_CONFIG: LayoutConfig = {
  id: 'common',
  mode: 'sidebarTop',
  header: {
    fixed: true,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: true,
      zIndex: null
    },
    secondHeader: {
      hidden: false,
      height: HEADER_FOLD_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: true,
    shrink: false,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_FOLD_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: true,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    hidden: false,
    zIndex: null
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

const TOP_NAV_LAYOUT_CONFIG: LayoutConfig = {
  id: 'topNav',
  mode: 'headerTop',
  header: {
    fixed: true,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: true,
      height: HEADER_OPEN_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: false,
    shrink: false,
    hidden: true,
    zIndex: null,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    }
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

const SIDEBAR_LAYOUT_CONFIG: LayoutConfig = {
  id: 'sidebar',
  mode: 'headerTop',
  header: {
    fixed: true,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: true,
      height: HEADER_OPEN_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: true,
    shrink: false,
    hidden: false,
    zIndex: null,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: true,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    }
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

const LEFT_RIGHT_LAYOUT_CONFIG: LayoutConfig = {
  id: 'leftRight',
  mode: 'sidebarTop',
  header: {
    fixed: true,
    hidden: false,
    zIndex: null,
    firstHeader: {
      height: HEADER_OPEN_HEIGHT,
      hidden: false,
      zIndex: null
    },
    secondHeader: {
      hidden: true,
      height: HEADER_OPEN_HEIGHT,
      zIndex: null
    }
  },
  sidebar: {
    fixed: true,
    shrink: false,
    hidden: false,
    zIndex: null,
    firstSidebar: {
      hidden: false,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    },
    secondSidebar: {
      hidden: true,
      width: SIDEBAR_OPEN_WIDTH,
      zIndex: null
    }
  },
  footer: {
    hidden: false,
    height: FOOTER_HEIGHT
  },
  hideLogo: false
};

export {
  SIDEBAR_FOLD_WIDTH,
  SIDEBAR_OPEN_WIDTH,
  HEADER_FOLD_HEIGHT,
  HEADER_OPEN_HEIGHT,
  FOOTER_HEIGHT,
  DEFAULT_LAYOUT_CONFIG,
  WATERFALL_LAYOUT_CONFIG,
  WIDE_LAYOUT_CONFIG,
  COMMON_LAYOUT_CONFIG,
  TOP_NAV_LAYOUT_CONFIG,
  SIDEBAR_LAYOUT_CONFIG,
  LEFT_RIGHT_LAYOUT_CONFIG
};
