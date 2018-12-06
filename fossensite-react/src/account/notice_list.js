import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  withStyles, Paper, Fade, List, ListItem,
  Avatar, ListItemText
} from '@material-ui/core';

import { Pagination, Loading, withErrorBoundary } from '../common/components'
import { parseUrlParams, formatDate } from '../common/tools'
import { Http404 } from '../common/errors'
import { noticeManager, userManager } from '../resource/manager'


const noticeItemStyle = theme => ({
  itemText: {
    fontSize: '1rem',
    color: theme.palette.primary.contrastText,
  },
  time: {
    fontSize: '0.875rem',
    color: 'gray',
  },
})


class NoticeListItem extends Component {
  render() {
    let { notice, classes } = this.props
    return (
      <ListItem>
        <Avatar src={notice.user.avatar} />
        <ListItemText classes={{primary: classes.itemText}}>
          <div>
            <a href={notice.user.github_url} target={"_blank"}>{notice.user.username}</a>
            &nbsp;在文章
            <Link to={`/article/${notice.article_id}/`}>
              《{notice.article__title}》
            </Link>中回复了你
          </div>
          <div className={classes.time}>{formatDate(notice.time)}</div>
          <div>{notice.content}</div>
        </ListItemText>
      </ListItem>
    )
  }
}
NoticeListItem = withStyles(noticeItemStyle)(NoticeListItem)


const noticeListStyle = theme => ({
  listTitle: {
    padding: '16px 24px',
  },
  paper: {
    paddingBottom: 8,
    marginBottom: 8,
  },
  empty: {
    margin: '3rem 0',
    fontSize: '1.25rem',
    textAlign: 'center',
    justifyContent: 'center',
  },
})


class NoticeList extends Component {
  constructor(props) {
    super(props)
    let { page } = this.getCurrentParams()
    this.state = {
      loading: false, noticeList: [], pageInfo: { page: page }, key: '',
    }
  }
  getCurrentParams() {
    // 获取当前的url参数
    let params = parseUrlParams(this.props.location.search)
    let { page } = params
    page = parseInt(page)
    page = (page ? page : 1)
    return { page: page }
  }
  async setNoticeList(page) {
    console.log('setNoticeList', page)
    // 收集key用于获取文章列表
    page = (page ? page : 1)
    let key = noticeManager.makeListKey(page)
    // 异步获取文章列表
    let noticeList = await noticeManager.getList(key)
    let pageInfo = { page: page }
    if (noticeManager.pageInfo[key]) {
      pageInfo.pageSize = noticeManager.pageInfo[key].pageSize
      pageInfo.total = noticeManager.pageInfo[key].total
    }
    // 更新组件state
    this.setState({
      loading: false, noticeList: noticeList, pageInfo: pageInfo, key: key
    })
    userManager.readNotice()
  }

  render() {
    let { page } = this.getCurrentParams()
    let key = noticeManager.makeListKey(page)
    let loading = this.state.loading

    if (key !== this.state.key && !loading) {
      loading = true
      this.setNoticeList(page)
    }

    // 获取数据时显示加载中
    if (loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return (<Loading />)
    }

    let { noticeList, pageInfo } = this.state
    let { classes } = this.props
    let items
    if (noticeList.length) {
      items = noticeList.map((notice) => {
        return (<NoticeListItem  key={notice.id} notice={notice} />
        )
      })
    } else if (pageInfo.page !== 1) {
      throw new Http404()
    } else {
      items = (<ListItem className={classes.empty}>暂时没有通知</ListItem>)
    }

    return (
      <Fade in>
        <Paper className={classes.paper}>
          <div className={classes.listTitle}>
            通知
          </div>
          <List>
            {items}
          </List>
          <Pagination url={pageInfo.url} page={pageInfo.page}
            pageSize={pageInfo.pageSize} total={pageInfo.total} />
        </Paper>
      </Fade>
    )
  }
}
NoticeList = withErrorBoundary(withStyles(noticeListStyle)(NoticeList))


export { NoticeList }
