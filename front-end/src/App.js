import React, { Component } from 'react';
import Cards from './components/cards';
import Label from './components/label';
import './components/cards.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    loading: false,
    ItemList: [],
    data: [],
    buttons: {},
    requestPaylod: {},
    nahData: false,
    itemsCount: 0,
  };

  theme = {
    colors: {
      bgColor: '#121212',
    },
  };

  setData = (data) => {
    let tempArray = [];

    for (let key in data) {
      const obj = {
        id: data[key].id,
        issueHref: data[key].issueHref,
        issueName: data[key].issueName,
        repoName: data[key].repoName,
        repoHref: data[key].repoHref,
        article: data[key].article,
        labels: data[key].labels,
      };
      tempArray.push(obj);
    }
    return tempArray;
  };

  loadItem = async (skips) => {
    this.setState({ loading: true, nahData: false }, () => {
      axios
        .post(
          'https://chekly.co/api/search_query/' + skips,
          JSON.stringify(this.state.requestPaylod),
          {
            headers: {
              // Overwrite Axios's automatically set Content-Type
              'Content-Type': 'application/json',
            },
          }
        )
        .then(({ data }) => {
          if (data.length === 0) {
            this.setState({
              nahData: true,
            });
          }
          this.setState({
            data: this.setData(data),
          });
          this.setState({
            loading: false,
          });
        })
        .catch((e) => {
          // API 호출이 실패한 경우
          console.error(e); // 에러표시
          this.setState({
            loading: true,
            nahData: true,
          });
        });
    });
  };

  onLabelClick = (button, name) => {
    let obj = this.state.buttons;
    if (button[name]) {
      obj[name] = true;
    }
    if (!button[name]) {
      delete obj[name];
    }
    this.setState({ obj });
  };

  onClickAnd = () => {
    let enabledList = [];

    for (let button in this.state.buttons) {
      const enabledButton = 'labels.' + button;
      enabledList.push({ [enabledButton]: { $exists: 'true' } });
    }

    this.setState(
      {
        requestPaylod: {
          $and: enabledList,
        },
      },
      () => this.loadItem(0)
    );
  };

  onClickOr = () => {
    let enabledList = [];

    for (let button in this.state.buttons) {
      const enabledButton = 'labels.' + button;
      enabledList.push({ [enabledButton]: { $exists: 'true' } });
    }

    this.setState(
      {
        requestPaylod: {
          $or: enabledList,
        },
      },
      () => this.loadItem(0)
    );
  };

  onClickAll = () => {
    this.setState(
      {
        requestPaylod: {},
      },
      () => this.loadItem(0)
    );
  };

  infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    let scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight === scrollHeight) {
      this.setState({ itemsCount: this.state.itemsCount + 8 }, () => {
        axios
          .post(
            'https://chekly.co/api/search_query/' + this.state.itemsCount,
            JSON.stringify(this.state.requestPaylod),
            {
              headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
              },
            }
          )
          .then(({ data }) => {
            this.setState({
              data: this.state.data.concat(this.setData(data)),
            });
          })
          .catch((e) => {
            // API 호출이 실패한 경우
            console.error(e); // 에러표시
            this.setState({
              loading: true,
            });
          });
      });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.infiniteScroll, true);
  }

  render() {
    const { loading, nahData } = this.state;

    return (
      <div className="container mt-4">
        <h1>Chekly - issue 검색기</h1>
        <hr />
        <div>
          <h5>태그 검색</h5>
          <div>
            <Label
              text="hacktoberfest"
              onLabelClick={this.onLabelClick}
              Bkey="hacktoberfest"
            />
            <Label
              text="핵토버페스트"
              onLabelClick={this.onLabelClick}
              Bkey="핵토버페스트"
            />
            <Label
              text="documentation"
              onLabelClick={this.onLabelClick}
              Bkey="documentation"
            />
            <Label
              text="enhancement"
              onLabelClick={this.onLabelClick}
              Bkey="enhancement"
            />
            <Label
              text="good first issue"
              onLabelClick={this.onLabelClick}
              Bkey="good first issue"
            />
            <div
              className="btn-group float-right"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onClickOr}
              >
                or
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onClickAnd}
              >
                and
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.onClickAll}
              >
                전체보기
              </button>
            </div>
          </div>
        </div>

        <hr />
        {nahData ? <h3>데이터가 존재하지 않습니다</h3> : null}
        {loading ? (
          <div className="d-flex justify-content-center">
            <div
              className="spinner-grow"
              style={{ width: '3rem', height: '3rem' }}
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <Cards data={this.state.data} />
        )}
      </div>
    );
  }
}

export default App;
