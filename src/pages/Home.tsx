import React, { useState } from "react";
import styled from "styled-components";

const initialLists = [
  {
    title: "lecture1",
    process: [{ title: "activity1" }],
  },
  {
    title: "lecture2",
    process: [{ title: "activity1" }, { title: "activity2" }],
  },
  {
    title: "lecture3",
    process: [
      { title: "activity1" },
      { title: "activity2" },
      { title: "activity3" },
    ],
  },
];

const initialDragData = {
  target: null,
  index: -1,
  move_down: [],
  move_up: [],
  updateLists: [],
};
interface ITodo {
  title: string;
  process: { title: string }[];
}

interface InitialDragData {
  target: any;
  index: number;
  move_down: number[];
  move_up: number[];
  updateLists: ITodo[];
}

const Home = () => {
  const [lists, setLists] = useState<ITodo[]>(initialLists);
  const [dragData, setDragData] = useState<InitialDragData>(initialDragData);
  const [isDragged, setIsDragged] = useState(false);

  const onDragStart = (e: React.DragEvent<HTMLElement>): void => {
    setIsDragged(true);
    setDragData({
      ...dragData,
      target: e.target,
      index: Number(e.currentTarget.dataset.index),
      updateLists: [...lists],
    });

    e.dataTransfer.setData("text/html", "");
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEnter = (e: React.DragEvent<HTMLElement>): void => {
    const _dragged = Number(dragData.target.dataset.index); // 처음 잡은 값
    const _index = Number(dragData.index); // 바로 전 값
    const _target = Number(e.currentTarget.dataset.index); // 현재 값
    let move_down = [...dragData.move_down];
    let move_up = [...dragData.move_up];

    let data = [...dragData.updateLists];
    data[_index] = data.splice(_target, 1, data[_index])[0];
    if (_dragged > _target) {
      move_down.includes(_target) ? move_down.pop() : move_down.push(_target);
    } else if (_dragged < _target) {
      move_up.includes(_target) ? move_up.pop() : move_up.push(_target);
    } else {
      move_down = [];
      move_up = [];
    }

    setDragData({
      ...dragData,
      updateLists: data,
      index: _target,
      move_up,
      move_down,
    });
  };
  const onDragLeave = (e: React.DragEvent<HTMLElement>): void => {
    if (e.target === dragData.target) {
      e.currentTarget.style.visibility = "hidden";
    }
  };
  const onDragEnd = (e: React.DragEvent<HTMLElement>): void => {
    setIsDragged(false);
    setLists([...dragData.updateLists]);

    setDragData({
      ...dragData,
      move_down: [],
      move_up: [],
      updateLists: [],
    });

    e.currentTarget.style.visibility = "visible";
    e.dataTransfer.dropEffect = "move";
  };

  const stopDragging = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    return true;
  };

  return (
    <Container>
      <List className="list" onDragOver={stopDragging}>
        {lists.map((e, i) => {
          let default_class = "";

          dragData.move_down.includes(i) && (default_class = "move_down");
          dragData.move_up.includes(i) && (default_class = "move_up");

          return (
            <ListItem
              key={i}
              data-index={i}
              draggable
              onDragStart={onDragStart}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
              className={default_class}
              isDragged={isDragged}
            >
              <p>{e.title}</p>
              {e.process.map((e, i) => {
                return (
                  <ListItem draggable isDragged={isDragged} key={i}>
                    {e.title}
                  </ListItem>
                );
              })}
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  * {
    padding: 0;
    margin: 0;
  }
`;

const List = styled.ul`
  width: 300px;
  list-style: none;
  background-color: #bf4949;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;

interface IListItem {
  isDragged: boolean;
}

const ListItem = styled.div<IListItem>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px 8px;
  ${(props) => props.isDragged && "transition: transform 200ms ease 0s"};
  user-select: none;
  touch-action: none;
  background-color: white;
  opacity: 0.5;
  cursor: grab;
  i {
    flex: 1;
  }
  p {
    flex: 6;
  }
  &.move_up {
    transform: translate(0, -100px);
    z-index: 1;
  }
  &.move_down {
    transform: translate(0, 100px);
    z-index: 1;
  }
  & > * {
    pointer-events: none;
  }
`;
