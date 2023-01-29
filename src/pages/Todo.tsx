import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface ITodo {
  main: string;
  images: string[];
}
interface InitialDragData {
  move_left: number[];
  move_right: number[];
  updateLists: ITodo;
}

const initialLists = {
  main: "main",
  images: ["image1", "image2", "image3", "image4", "image5"],
};

const Todo = () => {
  const [thumbnail, setThumbnail] = useState<ITodo>(initialLists);
  const [dragData, setDragData] = useState<InitialDragData>({
    move_left: [],
    move_right: [],
    updateLists: { ...thumbnail },
  });
  const [isDragged, setIsDragged] = useState(false);
  const clickedItem = useRef<number>(-1);

  const onDragStart = (e: React.DragEvent<HTMLElement>): void => {
    setIsDragged(true);
    clickedItem.current = Number(e.currentTarget.dataset.index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnter = (e: React.DragEvent<HTMLElement>): void => {
    const clickedIndex = clickedItem.current;
    const target = Number(e.currentTarget.dataset.index);
    let move_left = [...dragData.move_left];
    let move_right = [...dragData.move_right];

    let data = [thumbnail.main, ...thumbnail.images];
    const clicked = data.splice(clickedIndex, 1);
    data.splice(target, 0, ...clicked);

    if (clickedIndex > target) {
      move_left.includes(target) ? move_left.pop() : move_left.push(target);
    } else if (clickedIndex < target) {
      move_right.includes(target) ? move_right.pop() : move_right.push(target);
    } else {
      move_left = [];
      move_right = [];
    }

    e.currentTarget.style.cursor = "grabbing";
    setDragData({
      move_left,
      move_right,
      updateLists: { main: data[0], images: data.slice(1) },
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
    setThumbnail({ ...dragData.updateLists });

    clickedItem.current = -1;
    setDragData({
      move_left: [],
      move_right: [],
      updateLists: { main: "", images: [] },
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
      if (dragData.move_left.includes(index)) return "move_left";
      if (dragData.move_right.includes(index)) return "move_right";
      return "";
    },
    [dragData.move_left, dragData.move_right]
  );

  return (
    <Container>
      <List onDragOver={stopDragging}>
        {[thumbnail.main, ...thumbnail.images].map((e, i) => (
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
            <p>{e}</p>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Todo;

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
  background-color: #bf4949;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

interface IListItem {
  isDragged: boolean;
}

const ListItem = styled.div<IListItem>`
  align-items: center;
  width: 100px;
  height: 50px;
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
  &.move_right {
    transform: translate(-100px, 0);
  }
  &.move_left {
    transform: translate(100px, 0);
  }
  & > * {
    pointer-events: none;
  }
`;
