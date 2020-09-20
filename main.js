import {createElement, Component, render} from "./toy-react"

class MyComponent extends Component{
    render(){
        return <div>
            <h1>my Component</h1>
            {this.children}
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