import {createElement, Component, render} from "./toy-react"

class MyComponent extends Component{
    constructor(){
        super();
        this.state = {
            a: 1,
            b:2
        }
    }
    render(){
        return <div>
            <h1>my Component</h1>
            <button onclick={()=>{ this.setState({a:this.state.a++}) }}>add</button>
    <span>{this.state.a.toString()}</span>
    <span>{this.state.b.toString()}</span>
        </div>
    }
}

window.a = <MyComponent id='a' class='c'>
<div>happy</div>
<div></div>
<div></div>
</MyComponent>

render(<MyComponent id='a' class='c'>
    <div>happy</div>
    <div></div>
    <div></div>
</MyComponent>, document.body);