import React, { Component } from 'react';
import { Route } from "react-router-dom";
import { withStyles, Grid } from '@material-ui/core';


import { FrameGrid } from './common/components'
import ArticleList from './blog/article_list'
import SideBar from './blog/side_bar'
import ArticleDetail from './blog/article_detail'


const mainStyle = theme => ({
  root: {
    marginTop: 16,
    marginBottom: 16,
    '&>div': {
      // margin: '0 8px',
      padding: '0 8px',
    }
  },
  '@global': theme.global,
})


class Main extends Component {
  render() {
    let { classes } = this.props
    return (
      <FrameGrid container component={'main'} className={classes.root}>
        <Grid item md={8}>
          {/* <ArticleList /> */}
          {/* <ArticleDetail /> */}
          <Route exact path="/" component={ArticleList} />
          <Route path="/article/:id/" component={ArticleDetail} />
        </Grid>
        <Grid item md={4}>
          <SideBar />
        </Grid>
      </FrameGrid>
    );
  }
}


Main = withStyles(mainStyle)(Main)


export default Main