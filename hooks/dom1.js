const {useState} = React;

// 想象中的在函数中使用react特性的样子

const App = () => {
	const [next,setNext] = useState(1);
	let state = {
		count:0
	}

	const numAdd = () => {
		// setState({count:state.count+1});
		state = {count:state.count+1}
		setNext(next+1);
	}

	return(
		<div>
			<p>{next}</p>
			<p>{state.count}</p>
			<button onClick={numAdd}>
				add
			</button>
		</div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
);



// class
class A {
	constructor(){
		this.state = 1
	}
	add(){
		this.state++
		console.log(this.state);
	}
}

const a = new A();
a.add();

// 全局变量

let global = {count:0};

const add1 = () => {
	return global.count++;
}
add1();

//DOM

const count = 0;
const $counter = $('#counter');
$counter.data('count', count);

const add2 = () => {
	const newCount = parseInt($counter.data('count'), 10) + 1;
	$counter.data('count',newCount);
	return newCount;
}
add2();

// 闭包
const Counter = (() => {
	let count = 0;
	return {
		add:()=> {
			return count++
		}
	}
})();
Counter.add()
console.log(Counter.add(),'闭包');

// 其他全局存储：indexDB、LocalStorage 等等



function Counter(){
    const [count, dispatch] = useState(0)

    return (
        <div>
            <span>{count}</span>
            <button onClick={dispatch(count+1)}>add</button>
        </div>
    )
}




//存储结构

const fiber1 = {
    '1': hook1,
    '2': hook2,
    //...
}

// 如果用这种方法来存储，会需要为每一次 hook 的调用生成唯一的 key 标识，这个 key 标识需要在 mount 和 update 时从参数中传入以保证能路由到准确的 hook 对象。

const fiber2 = {
    //...
    memoizedState: {
        memoizedState: '1',
        queue: {
            last: {
                action: '2'
            },
            dispatch: dispatch,
        },
        next: {
            memoizedState: '1',
            queue: {
                // ...
            },
            next: null
        }
    },
    //...
}


// React Hook 的规范里要求：只能在函数组件的顶部使用，不能再条件语句和循环里使用
