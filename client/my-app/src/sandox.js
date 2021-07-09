import React from 'react';
import { Link } from 'react-router-dom';

class SandboxPage extends React.Component {
    render() {
        return (
            <div>
                <h2>HelloSandbox</h2>
                <div>
                    <Toggle />
                    <CustomTextInput />
                </div>
                <Link to={`/`}>Back to ApolloSandbox</Link>
            </div>
        );
    }
}

class Toggle extends React.Component {
    constructor(props) {
      super(props);
      console.log("constructor↓↓↓")
      console.log(this)
      this.state = {isToggleOn: true};
  
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      console.log("handleClick↓↓↓")
      console.log(this)
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render() {
      console.log("render↓↓↓")
      console.log(this)
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      );
    }
  }
  
  class CustomTextInput extends React.Component {
    constructor(props) {
      super(props);
      // textInput DOM 要素を保持するための ref を作成します。
      this.textInput = React.createRef();
      this.focusTextInput = this.focusTextInput.bind(this);
    }
  
    focusTextInput() {
      // 生の DOM API を使用して明示的にテキストの入力にフォーカスします。
      // 補足：DOM ノードを取得するために "current" にアクセスしています。
      this.textInput.current.focus();
    }
  
    render() {
      // コンストラクタで作成した `textInput` に <input> ref を関連付けることを
      // React に伝えます。
      return (
        <div>
          <input
            type="text"
            ref={this.textInput} />
          <input
            type="button"
            value="Focus the text input"
            onClick={this.focusTextInput}
          />
        </div>
      );
    }
  }

export default SandboxPage;