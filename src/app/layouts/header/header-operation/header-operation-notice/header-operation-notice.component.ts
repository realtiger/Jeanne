import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { Message, Notification, Todo } from '../../../../../types/header/notice';

@Component({
  selector: 'app-header-operation-notice',
  templateUrl: './header-operation-notice.component.html',
  styleUrls: ['./header-operation-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderOperationNoticeComponent implements AfterViewInit {
  @Output() countEvent = new EventEmitter<number>();

  tabActiveID: string | number = 'notice';
  tabTitles = {
    notice: '提醒',
    message: '未读消息',
    todo: '待办事项'
  };

  // TODO 临时数据
  notifications: Notification[] = [
    {
      type: 'success',
      title: '你提交的XXX申请已经通过',
      time: '1天前',
      icon: 'notice',
      id: '1',
      status: false
    },
    {
      type: 'warning',
      title: '你内推的人已经在走流程',
      time: '2天前',
      icon: 'message-2',
      id: '2',
      status: false
    },
    {
      type: 'warning',
      title: '2021年7月1日早有会议',
      time: '3天前',
      icon: 'message-2',
      id: '3',
      status: false
    },
    {
      type: 'info',
      title: '你提交的XXX申请已经通过',
      time: '4天前',
      icon: 'infomation',
      id: '4',
      status: false
    },
    {
      type: 'info',
      title: '你提交的XXX申请已经通过',
      time: '5天前',
      icon: 'infomation',
      id: '5',
      status: false
    },
    {
      type: 'info',
      title: '你提交的XXX申请已经通过',
      time: '5天前',
      icon: 'infomation',
      id: '6',
      status: false
    }
  ];
  messages: Message[] = [
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX发件人',
      content: '左侧头像为发信者的头像，收到的来自别人的未读信息',
      time: '2天前',
      id: '1',
      status: false
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '2',
      status: false
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '3',
      status: false
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '4',
      status: false
    },
    {
      image: 'https://res.hc-cdn.com/x-roma-components/1.0.10/assets/devui/logo.svg',
      title: '来自XXX',
      content: '收到的来自别人的未读信息',
      time: '2天前',
      id: '5',
      status: false
    }
  ];
  todos: Todo[] = [
    {
      tagName: '进行中',
      tagType: 'olivine-w98',
      title: '参加可信考试',
      memo: '一年内要通过考试，持证上岗',
      id: '1',
      status: false
    },
    {
      tagName: '已逾期2天',
      tagType: 'orange-w98',
      title: 'Bug单处理',
      memo: '有个bug单需要处理，来自SL的指派',
      id: '2',
      status: false
    },
    {
      tagName: '待开始',
      tagType: 'blue-w98',
      title: '待办事项名称',
      memo: '右侧为事项相关说明',
      id: '3',
      status: false
    },
    {
      tagName: '逾期10天',
      tagType: 'red-w98',
      title: '待办事项名称',
      memo: '对于该事项的描述',
      id: '4',
      status: false
    }
  ];

  get noticeTitle() {
    const length = this.notifications.filter(n => !n.status).length;
    return `${this.tabTitles.notice}(${length})`;
  }

  get messageTitle() {
    const length = this.messages.filter(m => !m.status).length;
    return `${this.tabTitles.message}(${length})`;
  }

  get todoTitle() {
    const length = this.todos.filter(t => !t.status).length;
    return `${this.tabTitles.todo}(${length})`;
  }

  ngAfterViewInit() {
    this.updateUnreadCount();
  }

  // 更新未读消息数
  updateUnreadCount() {
    const unreadCount = this.notifications.filter(n => !n.status).length + this.messages.filter(m => !m.status).length + this.todos.filter(t => !t.status).length;
    this.countEvent.emit(unreadCount);
  }

  handleNoticeClick(type: 'notice' | 'message' | 'todo', id: string) {
    switch (type) {
      case 'notice': {
        const index = this.notifications.findIndex(n => n.id === id);
        this.notifications[index].status = true;
        break;
      }
      case 'message': {
        const index = this.messages.findIndex(m => m.id === id);
        this.messages[index].status = true;
        break;
      }
      case 'todo': {
        const index = this.todos.findIndex(t => t.id === id);
        this.todos[index].status = true;
      }
    }
    this.updateUnreadCount();
  }

  handleClean(type: 'notice' | 'message' | 'todo') {
    switch (type) {
      case 'notice': {
        this.notifications = [];
        break;
      }
      case 'message': {
        this.messages = [];
        break;
      }
      case 'todo': {
        this.todos = [];
      }
    }
    this.updateUnreadCount();
  }
}
