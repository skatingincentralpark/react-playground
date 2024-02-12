import React, { useContext, useEffect } from "react";
import { NavigationContext, useNavigation } from "./NavigationContext";
import {
  AnotherVerySlowComponent,
  VerySlowComponent,
} from "./VerySlowComponent";

const AdjustableColumnsBlock = () => {
  const { isNavExpanded } = useNavigation();
  const Square = () => <div className="aspect-square h-40 bg-lime-300" />;

  return (
    <div className="flex gap-4">
      {isNavExpanded ? (
        <>
          <Square />
          <Square />
        </>
      ) : (
        <>
          <Square />
          <Square />
          <Square />
        </>
      )}
    </div>
  );
};

const withNavigationOpen = (AnyComponent: any) => {
  // wrap the component from the arguments in React.memo here
  const AnyComponentMemo = React.memo(AnyComponent);

  return (props: any) => {
    const { open } = useContext(NavigationContext);

    // return memoized component here
    // now it won't re-render because of Context changes
    // make sure that whatever is passed as props here don't change between re-renders!
    return <AnyComponentMemo {...props} openNav={open} />;
  };
};

const MainPart = withNavigationOpen(({ openNav }: { openNav: () => void }) => {
  useEffect(() => {
    // won't be triggered when context value changes
    // because toggleNav is coming from memoized HOC
    console.info("Main part re-render");
  });

  return (
    <>
      <div className="">
        <button
          onClick={openNav}
          className="border py-2 px-4 bg-gray-100 rounded"
        >
          click to expand nav - inside heavy component
        </button>
      </div>
      <VerySlowComponent />
      <AnotherVerySlowComponent />
      <AdjustableColumnsBlock />
    </>
  );
});

export default MainPart;
