import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
	const [numberList, setNumberList] = useState([]);
	const [tempVal, setTempVal] = useState("");
	const [checkedList, setCheckedList] = useState([]);
	const [count, setCount] = useState(0);

	const handleChecked = (newList) => {
		const tempNewList = newList.filter((list) => !checkedList.includes(parseInt(Object.keys(list))));

		const tempCheckedList = newList.filter((list) => checkedList.includes(parseInt(Object.keys(list))));

		if (tempNewList.length > 0) {
			const highestObjIndex = tempNewList.indexOf(tempNewList.reduce((a, b) => (Object.values(a) > Object.values(b) ? a : b)));

			const highestNum = tempNewList.splice(highestObjIndex, 1)[0];

			tempNewList.unshift(highestNum);

			const lowestObjIndex = tempNewList.indexOf(tempNewList.reduce((a, b) => (Object.values(a) < Object.values(b) ? a : b)));

			const lowestNum = tempNewList.splice(lowestObjIndex, 1)[0];

			tempNewList.push(lowestNum);

			tempNewList.splice(1, 0, ...tempCheckedList);

			setNumberList(tempNewList);
		}
	};

	const handleOnSubmit = (e) => {
		if (!tempVal || tempVal < 0) {
			setTempVal("");
			return;
		}
		let newList = [...numberList, { [count]: parseInt(tempVal) }];

		if (Object.keys(numberList).length === 0) {
			setNumberList(newList);
		} else {
			handleChecked(newList);
		}

		const newCount = count + 1;
		setCount(newCount);
		window.localStorage.setItem("numberList", JSON.stringify(newList));
		window.localStorage.setItem("count", JSON.stringify(newCount));
		setTempVal("");
	};

	useEffect(() => {
		const numList = JSON.parse(window.localStorage.getItem("numberList"));
		if (numList) {
			setNumberList(numList);
		}
		const chckList = JSON.parse(window.localStorage.getItem("checkedList"));
		if (chckList) {
			setCheckedList(chckList);
		}
		const tempCount = JSON.parse(window.localStorage.getItem("count"));
		if (tempCount) {
			setCount(tempCount);
		}
	}, []);

	useEffect(() => {
		const newList = [...numberList];
		if (newList.length > 0) {
			handleChecked(newList);
		}
	}, [checkedList, numberList]);

	const handleSelect = (num) => {
		let tempCheckList = [...checkedList];

		let [key] = Object.entries(num)[0];

		key = parseInt(key);

		if (checkedList.includes(key)) {
			const indx = checkedList.indexOf(key);

			tempCheckList.splice(indx, 1);
			setCheckedList(tempCheckList);
		} else {
			tempCheckList.push(key);

			setCheckedList(tempCheckList);
		}

		window.localStorage.setItem("checkedList", JSON.stringify(tempCheckList));
	};

	const handleChange = (e) => {
		setTempVal(e.target.value);
	};

	return (
		<div className="App">
			{numberList &&
				numberList.map((num) => (
					<div key={Object.keys(num)} className="numberListWrapper">
						<p className={checkedList.includes(parseInt(Object.keys(num)[0])) ? "checkedItem" : "uncheckedItem"}>Number: {Object.values(num)}</p>
						<input min="0" checked={checkedList.includes(parseInt(Object.keys(num)[0])) ? true : false} type="checkbox" onChange={() => handleSelect(num)} />
					</div>
				))}

			<div>
				<input type="number" value={tempVal} onChange={handleChange} />

				<button onClick={() => handleOnSubmit()}>Submit</button>
			</div>
		</div>
	);
};

export default App;
