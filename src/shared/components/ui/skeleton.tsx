import { View } from 'react-native';

function Skeleton({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={`animate-pulse bg-muted ${className ?? 'rounded-md'}`} {...props} />;
}

export { Skeleton };
