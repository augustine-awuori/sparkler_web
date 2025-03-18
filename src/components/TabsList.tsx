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
    display: flex;
    flex-wrap: wrap;
    gap: 5px; /* Optional: add a small gap between tabs */
    justify-content: space-evenly;

    .tab {
      color: #777;
      padding: 0 10px; /* Adjust padding to fit better on smaller screens */
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 15px;
      min-width: 80px; /* Set a minimum width for each tab */

      &:hover {
        background-color: #111;
      }

      &__label {
        position: relative;
        padding: 10px 15px; /* Adjust padding for smaller screens */

        &.active {
          color: white;

          &::after {
            content: "";
            height: 3px;
            width: 100%;
            background-color: var(--primary-color);
            border-radius: 40px;
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }

  @media (max-width: 600px) {
    /* Optional: further adjustments for very small screens */
    .tab-list {
      justify-content: center; /* Center the tabs */
    }

    .tab {
      font-size: 14px;
      padding: 0 5px;
    }
  }
`;

export default TabsList;
