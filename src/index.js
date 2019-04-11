import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  CardActionArea,
  CardContent,
  Card,
  Typography,
  CardMedia,
  Button,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { getQueryResult } from './actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      hasMore: true,
      reqestNumber: 1,
      isLoading: false,
      val: '',
    };

    window.onscroll = () => {
      const { error, isLoading, hasMore } = this.state;

      if (error || isLoading || !hasMore) return;

      if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 400) {
        this.handleFetchBooks();
      }
    };
  }

  handleFetchBooks = (onInit = false) => {
    const { reqestNumber } = this.state;
    let start = 10 * reqestNumber;
    let amount = 10;
    let payload = { isLoading: true };
    if (onInit) {
      start = 0;
      amount = 19;
      payload = { ...payload, hasMore: true, data: [], reqestNumber: 1 };
    }
    this.setState({ ...payload }, () =>
      getQueryResult(this.state.val, start, amount)
        .then(response => {
          const { items, totalItems } = response;
          const { data } = this.state;

          if (totalItems === 0) {
            this.setState({ totalItems, isLoading: false });
            return;
          }

          if (!items) {
            this.setState({ isLoading: false, hasMore: false });
            return;
          }

          const hasMore = items.length + data.length < totalItems;
          this.setState(prevState => ({
            data: items ? [...prevState.data, ...items] : prevState.data,
            reqestNumber: prevState.reqestNumber + 1,
            totalItems,
            isLoading: false,
            hasMore,
          }));
        })
        .catch(() => window.location.reload())
    );
  };

  renderBooks = () => {
    const { data, totalItems } = this.state;
    if (data.length)
      return data.map((item, idx) => (
        <div key={idx}>
          <Card style={{ margin: 10 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="200"
                src={
                  item.volumeInfo.imageLinks
                    ? item.volumeInfo.imageLinks.thumbnail
                    : 'https://www.lonestargrapefruit.com/images/images.jpg'
                }
                style={{ objectFit: 'contain' }}
              />
              <CardContent>
                <Typography variant="title">{item.volumeInfo.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.volumeInfo.description ? item.volumeInfo.description : 'No description provided.'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      ));

    if (totalItems === 0) return <Typography color="error">No books were found</Typography>;

    return null;
  };

  render() {
    const { isLoading, hasMore } = this.state;

    return (
      <React.Fragment>
        <section>
          <Typography color="textPrimary" variant="h6">
            INFINITE SCROLL DEMO
          </Typography>
          <div className="search-bar">
            <TextField
              onKeyPress={ev => {
                if (ev.key === 'Enter') {
                  this.inpRef.blur();
                  this.handleFetchBooks(true);
                }
              }}
              inputRef={node => (this.inpRef = node)}
              autoComplete="off"
              label="Enter title"
              color="primary"
              margin="normal"
              variant="outlined"
              value={this.state.val}
              onChange={e => this.setState({ val: e.target.value })}
            />
            <Button
              style={{ alignSelf: 'center', margin: '10px 0 0 8px' }}
              color="primary"
              onClick={() => this.handleFetchBooks(true)}>
              search
            </Button>
          </div>
        </section>
        <div className="cards">
          {this.renderBooks()}
          {isLoading && <LinearProgress color="primary" />}
          {!hasMore && (
            <Typography style={{ margin: 50 }} color="textPrimary" align="center" variant="h5">
              No more items
            </Typography>
          )}
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
