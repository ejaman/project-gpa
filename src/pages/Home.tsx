import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface ITodo {
  title: string;
  process: string[];
}
interface InitialDragData {
  move_up: number[];
  move_down: number[];
  updateLists: ITodo[];
}

const initialLists = [
  { title: "task1", process: ["act1"] },
  { title: "task2", process: ["act1", "act2"] },
  { title: "task3", process: ["act1", "act2", "act3"] },
];

const Home = () => {
  const [processData, setProcessData] = useState<ITodo[]>(initialLists);
  const [dragData, setDragData] = useState<InitialDragData>({
    move_up: [],
    move_down: [],
    updateLists: [...processData],
  });
  const [isDragged, setIsDragged] = useState(false);
  const clickedItem = useRef<number>(-1);

  const onDragStart = (e: React.DragEvent<HTMLElement>): void => {
    console.log(e.currentTarget);

    setIsDragged(true);
    clickedItem.current = Number(e.currentTarget.dataset.index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e: React.DragEvent<HTMLElement>): void => {
    const clickedIndex = clickedItem.current;
    const target = Number(e.currentTarget.dataset.index);
    let move_up = [...dragData.move_up];
    let move_down = [...dragData.move_down];

    let data = [...processData];
    const clicked = data.splice(clickedIndex, 1);
    data.splice(target, 0, ...clicked);

    if (clickedIndex > target) {
      move_up.includes(target) ? move_up.pop() : move_up.push(target);
    } else if (clickedIndex < target) {
      move_down.includes(target) ? move_down.pop() : move_down.push(target);
    } else {
      move_up = [];
      move_down = [];
    }

    e.currentTarget.style.cursor = "grabbing";
    setDragData({
      move_up,
      move_down,
      updateLists: data,
    });
  };

  const onDragLeave = (e: React.DragEvent<HTMLElement>): void => {
    const target = Number(e.currentTarget.dataset.index);
    if (target === clickedItem.current) {
      e.currentTarget.style.visibility = "hidden";
    }
  };

  const onDragEnd = (e: React.DragEvent<HTMLElement>): void => {
    setIsDragged(false);
    setProcessData([...dragData.updateLists]);

    clickedItem.current = -1;
    setDragData({
      move_up: [],
      move_down: [],
      updateLists: [...processData],
    });

    e.currentTarget.style.visibility = "visible";
    e.dataTransfer.dropEffect = "move";
  };

  const stopDragging = (e: React.DragEvent<HTMLElement>): void => {
    e.stopPropagation();
    e.preventDefault();
  };

  const moveClassName = useCallback(
    (index: number): string => {
      if (dragData.move_up.includes(index)) return "move_up";
      if (dragData.move_down.includes(index)) return "move_down";
      return "";
    },
    [dragData.move_up, dragData.move_down]
  );

  const onClick = () => {
    console.log("click");
  };

  return (
    <Container>
      <List onDragOver={stopDragging}>
        {processData.map((e, i) => (
          <ListItem
            key={i}
            data-index={i}
            className={moveClassName(i)}
            isDragged={isDragged}
            draggable
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragEnd={onDragEnd}
          >
            <Item>{e.title}</Item>

            {e.process.map((act, i) => (
              <Item key={i} onClick={onClick}>
                act
              </Item>
            ))}
          </ListItem>
        ))}
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
  width: 800px;
  list-style: none;
  background-color: #49bf86;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 10px;
`;

interface IListItem {
  isDragged: boolean;
}

const ListItem = styled.div<IListItem>`
  align-items: center;
  ${(props) => props.isDragged && "transition: transform 200ms ease 0s"};
  user-select: none;
  touch-action: none;
  background-color: white;
  padding: 10px;
  cursor: grab;
  i {
    flex: 1;
  }
  p {
    flex: 6;
  }
  &.move_down {
    transform: translate(0, -50px);
  }
  &.move_up {
    transform: translate(0, 50px);
  }
  & > * {
    pointer-events: none;
  }
`;

const Items = styled.div``;

const Item = styled.div`
  align-items: center;
  width: 500px;
  height: 50px;
  background-color: #649164;
`;
