import React from "react";
import ReactDOM from "react-dom";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: (new Array(20)).fill(null).map(() => (new Array(10)).fill(null)),
      points: 0,
      move_counts: 0,
      fall_speed: 300,
      current_tetrimino: generateTetrimino(),
      isInitialize: true,
      current_coodinate: {x: 4, y: 0},
      next_tetriminos: [generateTetrimino(), generateTetrimino(), generateTetrimino(), generateTetrimino(), generateTetrimino()],
    }
  }

  // 降下中のテトリミノの状態をセットし，描写する
  tetriminoSet() {
    let squares = this.state.squares;
    for(let i = 0; i < 4; i += 1) {
      let x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'];
      let y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'];
      squares[y][x] = this.state.current_tetrimino['type'];
    }
    this.setState({squares: squares});
  }

  // 降下中のテトリミノの状態をアンセットする
  tetriminoUnset() {
    let squares = this.state.squares;
    for (let i = 0; i < 4; i += 1) {
      let x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'];
      let y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'];
      squares[y][x] = null;
    }
    this.setState({ squares: squares });
  }

  // current_coodinateを変更する
  setNextCoodinate(moveX=0, moveY=1) {
    let x, y;
    let isSet = true; // 次のcoodinateでセットできるか判定する．

    for(let i = 0; i < 4; i += 1) {
      x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'] + moveX;
      y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'] + moveY;

      if ((x > 9 || x < 0) || (y > 19 || y < 0) || this.state.squares[y][x]) {
        isSet = false;
        break;
      }
    }
    // 次のcoodinateでセットできる場合は，current_coodinateをセットする
    if (isSet) {
      this.setState({ current_coodinate: { x: this.state.current_coodinate['x'] + moveX, y: this.state.current_coodinate['y'] + moveY } });
      return true;
    }
    // セットできない場合は，
    else {
      return false;
    }
  }

  // テトリミノを回転させる
  rotateCoodinate(direction) {
    let x, y;
    let isSet = true; // 次のcoodinateでセットできるか判定する．
    let now_id = this.state.current_tetrimino['id'];
    let newTetrimino;
    console.log(now_id);

    if (direction == 'right') {
      newTetrimino = returnTetrimino((now_id+100)%400);
      this.setState({current_tetrimino: newTetrimino});
    } else if (direction == 'left') {
      now_id = (now_id-100 < 0) ? now_id+400 : now_id
      newTetrimino = returnTetrimino((now_id-100)%400);
      this.setState({current_tetrimino: newTetrimino})
    }

    for(let i = 0; i < 4; i += 1) {
      x = this.state.current_coodinate['x'] + this.state.current_tetrimino['position'][i]['x'];
      y = this.state.current_coodinate['y'] + this.state.current_tetrimino['position'][i]['y'];

      if ((x > 9 || x < 0) || (y > 19 || y < 0) || this.state.squares[y][x]) {
        isSet = false;
        break;
      }
    }
    // 次のcoodinateでセットできる場合は，current_coodinateをセットする
    if (isSet) {
      this.setState({ current_coodinate: { x: this.state.current_coodinate['x'], y: this.state.current_coodinate['y'] } });
      return true;
    }
    // セットできない場合は，
    else {
      return false;
    }
  }

  handleKeyDown(e) {
    let x = this.state.current_coodinate['x'];
    let y = this.state.current_coodinate['y'];
    console.log(e.keyCode);
    switch(e.keyCode) {
      case 37:
        this.tetriminoUnset();
        this.setNextCoodinate(-1, 0);
        this.tetriminoSet();
        break;
      case 39:
        this.tetriminoUnset();
        this.setNextCoodinate(1, 0);
        this.tetriminoSet();
        break;
      case 40:
        this.tetriminoUnset();
        this.setNextCoodinate(0, 1);
        this.tetriminoSet();
        break;
      case 83:
        this.tetriminoUnset();
        this.rotateCoodinate('left');
        this.tetriminoSet();
        break;
      case 76:
        this.tetriminoUnset();
        this.rotateCoodinate('right');
        this.tetriminoSet();
        break;
    }
  }

  countDown() {
    // テトリミノを初期位置にセットする場合
    if (this.state.isInitialize) {
      let next_tetriminos = this.state.next_tetriminos;
      this.setState({isInitialize: false});
      this.setState({current_tetrimino: next_tetriminos[0]});
      next_tetriminos.shift();
      next_tetriminos.push(generateTetrimino());
      // this.tetriminoUnset();
      this.tetriminoSet();
    }
    // テトリミノを初期位置にセットしない場合
    else {
      this.tetriminoUnset();
      if (!this.setNextCoodinate()) {
        this.setState({isInitialize: true});
        this.tetriminoSet();
        this.setState({current_coodinate: {x: 4, y: 0}});
      } else {
        this.tetriminoSet();
      }
    }
  }

  // 初期化時に、countDownメソッドを1秒ごとに呼び出すタイマーを設定
  componentDidMount() {
    this.interval = setInterval(() => this.countDown(), this.state.fall_speed);
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  // 終了処理として、タイマーをクリアする
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container">
        <RecordArea points={this.state.points} move_counts={this.state.move_counts} />
        <PlayArea current_tetrimino={this.state.current_tetrimino}
                  current_coodinate={this.state.current_coodinate}
                  fall_speed={this.state.fall_speed}
                  squares={this.state.squares}
                  onKeyDown={() => console.log('TETRIS')} />
        <NextTetriminosArea next_tetriminos={this.state.next_tetriminos} />
      </div>
    );
  }
}

class RecordArea extends React.Component {
  render() {
    return (
      <div id="record-area-box">
        <h1>Record Area</h1>
        <p>points = {this.props.points}</p>
        <p>move counts = {this.props.move_counts}</p>
      </div>
    );
  }
}

class PlayArea extends React.Component {
  render() {
    return (
      <div id="play-area-box">
        <table>
          <tbody>
            <PlayAreaColumn column={this.props.squares[0]} />
            <PlayAreaColumn column={this.props.squares[1]}/>
            <PlayAreaColumn column={this.props.squares[2]}/>
            <PlayAreaColumn column={this.props.squares[3]}/>
            <PlayAreaColumn column={this.props.squares[4]}/>
            <PlayAreaColumn column={this.props.squares[5]}/>
            <PlayAreaColumn column={this.props.squares[6]}/>
            <PlayAreaColumn column={this.props.squares[7]}/>
            <PlayAreaColumn column={this.props.squares[8]}/>
            <PlayAreaColumn column={this.props.squares[9]}/>
            <PlayAreaColumn column={this.props.squares[10]}/>
            <PlayAreaColumn column={this.props.squares[11]}/>
            <PlayAreaColumn column={this.props.squares[12]}/>
            <PlayAreaColumn column={this.props.squares[13]}/>
            <PlayAreaColumn column={this.props.squares[14]}/>
            <PlayAreaColumn column={this.props.squares[15]}/>
            <PlayAreaColumn column={this.props.squares[16]}/>
            <PlayAreaColumn column={this.props.squares[17]}/>
            <PlayAreaColumn column={this.props.squares[18]}/>
            <PlayAreaColumn column={this.props.squares[19]}/>
          </tbody>
        </table>
      </div>
    );
  }
}

class PlayAreaColumn extends React.Component {
  render() {
    return (
      <tr>
        <PlayAreaSquare square={this.props.column[0]} />
        <PlayAreaSquare square={this.props.column[1]} />
        <PlayAreaSquare square={this.props.column[2]} />
        <PlayAreaSquare square={this.props.column[3]} />
        <PlayAreaSquare square={this.props.column[4]} />
        <PlayAreaSquare square={this.props.column[5]} />
        <PlayAreaSquare square={this.props.column[6]} />
        <PlayAreaSquare square={this.props.column[7]} />
        <PlayAreaSquare square={this.props.column[8]} />
        <PlayAreaSquare square={this.props.column[9]} />
      </tr>
    );
  }
}

class PlayAreaSquare extends React.Component {
  render() {
    return (
      <td className={this.props.square}></td>
    );
  }
}

class NextTetriminosArea extends React.Component {
  render() {
    return (
      <div id="next-tetriminos-area-box">
        <h1>Next Tetriminos Area</h1>
        <p>{this.props.next_tetriminos[0]['type']}</p>
        <p>{this.props.next_tetriminos[1]['type']}</p>
        <p>{this.props.next_tetriminos[2]['type']}</p>
        <p>{this.props.next_tetriminos[3]['type']}</p>
        <p>{this.props.next_tetriminos[4]['type']}</p>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Game />, app);

function generateTetrimino() {
  return returnTetrimino(Math.floor((Math.random()) * 7));
}

function returnTetrimino(tetrimino_id) {
  switch(tetrimino_id) {
    case 0:
      return {type: 'I', position: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}], rotate: 0, id: 0};
    case 1:
      return {type: 'O', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}], rotate: 0, id: 1};
    case 2:
      return {type: 'T', position: [{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:1, y:0}], rotate: 0, id: 2};
    case 3:
      return {type: 'J', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:1}, {x:2, y:1}], rotate: 0, id: 3};
    case 4:
      return {type: 'L', position: [{x:2, y:0}, {x:0, y:1}, {x:1, y:1}, {x:2, y:1}], rotate: 0, id: 4};
    case 5:
      return {type: 'S', position: [{x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:1, y:1}], rotate: 0, id: 5};
    case 6:
      return {type: 'Z', position: [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}], rotate: 0, id: 6};
    case 100:
      return {type: 'I', position: [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}], rotate: 90, id: 100};
    case 101:
      return {type: 'O', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}], rotate: 90, id: 101};
    case 102:
      return {type: 'T', position: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:1}], rotate: 90, id: 102};
    case 103:
      return {type: 'J', position: [{x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:0, y:2}], rotate: 90, id: 103};
    case 104:
      return {type: 'L', position: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}], rotate: 90, id: 104};
    case 105:
      return {type: 'S', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:1}, {x:1, y:2}], rotate: 90, id: 105};
    case 106:
      return {type: 'Z', position: [{x:1, y:0}, {x:1, y:1}, {x:0, y:1}, {x:0, y:2}], rotate: 90, id: 106};
    case 200:
      return {type: 'I', position: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}], rotate: 180, id: 200};
    case 201:
      return {type: 'O', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}], rotate: 180, id: 201};
    case 202:
      return {type: 'T', position: [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:1, y:1}], rotate: 180, id: 202};
    case 203:
      return {type: 'J', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:2, y:0}], rotate: 180, id: 203};
    case 204:
      return {type: 'L', position: [{x:2, y:0}, {x:0, y:0}, {x:1, y:0}, {x:2, y:1}], rotate: 180, id: 204};
    case 205:
      return {type: 'S', position: [{x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:1, y:1}], rotate: 180, id: 205};
    case 206:
      return {type: 'Z', position: [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}], rotate: 180, id: 206};
    case 300:
      return {type: 'I', position: [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}], rotate: 270, id: 300};
    case 301:
      return {type: 'O', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}], rotate: 270, id: 301};
    case 302:
      return {type: 'T', position: [{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:0, y:1}], rotate: 270, id: 302};
    case 303:
      return {type: 'J', position: [{x:1, y:0}, {x:1, y:1}, {x:1, y:2}, {x:0, y:2}], rotate: 270, id: 303};
    case 304:
      return {type: 'L', position: [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:1, y:2}], rotate: 270, id: 304};
    case 305:
      return {type: 'S', position: [{x:0, y:0}, {x:0, y:1}, {x:1, y:1}, {x:1, y:2}], rotate: 270, id: 305};
    case 306:
      return {type: 'Z', position: [{x:1, y:0}, {x:1, y:1}, {x:0, y:1}, {x:0, y:2}], rotate: 270, id: 306};
  }
}
