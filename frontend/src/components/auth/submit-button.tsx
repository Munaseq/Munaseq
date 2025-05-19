import Button from '../common/buttons/button';
import LogoLoading from '../common/logo-loading';

export default function SubmitButton({ children, isLoading }: { children: any, isLoading: boolean }) {

  if (!isLoading) {
    return <Button className="shadow-xl w-full">{children}</Button>;
  }
  return <LogoLoading className={'w-14 aspect-square absolute'} />;
}
