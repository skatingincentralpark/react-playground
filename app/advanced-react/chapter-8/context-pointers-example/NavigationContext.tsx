import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const NavigationContext = createContext({
  isNavExpanded: false,
  toggle: () => {},
  close: () => {},
  open: () => {},
});

export const NavigationController = ({ children }: { children: ReactNode }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const toggle = useCallback(() => {
    setIsNavExpanded(!isNavExpanded);
  }, [isNavExpanded]);

  const open = useCallback(() => {
    setIsNavExpanded(true);
  }, []);
  const close = useCallback(() => {
    setIsNavExpanded(false);
  }, []);
  const value = useMemo(() => {
    return { isNavExpanded, toggle, close, open };
  }, [isNavExpanded, toggle, close, open]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
