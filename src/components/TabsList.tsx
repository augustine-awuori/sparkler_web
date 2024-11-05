import classNames from "classnames";
import styled from "styled-components";

export type Tab<T> = { id: T; label: string };

interface Props<T> {
  activeTabId: T;
  onTabClick: (tabId: T) => void;
  tabs: Tab<T>[];
}

function TabsList<T>({ activeTabId, onTabClick, tabs }: Props<T>) {
  return (
    <Container tabCount={tabs.length}>
      <div className="tab-list">
        {tabs.map((tab, index) => (
          <button
            onClick={() => onTabClick(tab.id)}
            className="tab"
            key={index}
          >
            <span
              className={classNames(
                "tab__label",
                activeTabId === tab.id && "active"
              )}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div<{ tabCount: number }>`
  .tab-list {
    margin-top: 10px;
    border-bottom: 1px solid #333;
    display: grid;
    grid-template-columns: repeat(${(props) => props.tabCount}, 1fr);

    .tab {
      color: #777;
      padding: 0 35px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 15px;

      &:hover {
        background-color: #111;
      }

      &__label {
        position: relative;
        padding: 20px 30px;

        &.active {
          color: white;

          &::after {
            content: "";
            height: 3px;
            width: 100%;
            background-color: var(--theme-color);
            border-radius: 40px;
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }
`;

export default TabsList;
