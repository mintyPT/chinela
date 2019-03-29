import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import _ from "lodash";
import OutsideAlerter from "./OutsideAlerter";
import "./styles.css";

const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

const StyledInput = styled.input`
  border: none;
  border-bottom: 2px solid #ccc;
  margin-bottom: 2px;
  margin: 0;
  padding: 4px 0;
  font-size: 24px;
  display: inline-block;
  &:focus {
    outline: none;
  }
`;

const StyledShow = styled.span`
  font-size: 24px;
  margin: 0;
  padding: 4px 0;
  border-bottom: 2px solid red;
  margin-bottom: 2px;
  display: inline-block;
`;

class Input extends React.Component {
  onChange = e => {
    this.props.onChange(e.target.value);
  };
  render() {
    return <StyledInput {...this.props} onChange={this.onChange} />;
  }
}

class Pencil extends React.Component {
  state = {
    items: [
      { id: 1, text: "one", focused: false },
      { id: 2, text: "two", focused: false }
    ]
  };

  onChange = (id, value) => {
    this.updateElement(id, { text: value });
  };

  updateElement = (id, data) => {
    const { items } = this.state;
    const idx = _.findIndex(items, item => item.id === id);
    const item = _.assign({}, items[idx], data);
    items[idx] = item;
    console.log(items);
    this.setState({ items });
  };

  clickedInside = id => {
    this.updateElement(id, { focused: true });
  };
  clickedOutside = id => {
    this.updateElement(id, { focused: false });
  };
  addItemAfter = id => {
    const { items } = this.state;
    const idx = _.findIndex(items, item => item.id === id);

    const nitems = insert(items, idx + 1, { id: Math.random(), text: "oi" });
    this.setState({ items: nitems });
  };
  render() {
    const list = this.state.items.map(item => {
      const inp = (
        <Input
          value={item.text}
          onChange={(...etc) => this.onChange(item.id, ...etc)}
          onKeyPress={e => {
            console.log(">>", e.key);
            if (e.key === "Enter") {
              this.addItemAfter(item.id);
            }
          }}
        />
      );
      const show = <StyledShow>{item.text}</StyledShow>;

      return (
        <OutsideAlerter
          key={item.id}
          onClickOutside={() => this.clickedOutside(item.id)}
          onClick={() => this.clickedInside(item.id)}
        >
          ‣ {item.focused ? inp : show}
        </OutsideAlerter>
      );
    });
    return (
      <div>
        <div>
          <button>b</button>
          <button>i</button>
          {" ___ "}
          <button>yellow</button>
          <button>pink</button>
          {" ___ "}
          <button>&lt;</button>
          <button>&gt;</button>
        </div>
        {list}
        <br />
        <br />
        <br />
        <br />
        <pre>{JSON.stringify(this.state.items, null, 4)}</pre>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Pencil />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
