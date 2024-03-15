import { Alert } from 'react-bootstrap';
import classNames from 'classnames';

const DefaultAlerts = () => {
  let variant = 'danger';

  return (
        <Alert
          variant={variant}
          className={classNames(
            variant === 'light' ? 'text-dark' : 'text-' + variant
          )}
        >
          <div className='text-center'>
            <small>아이디 또는 비밀번호를 잘못 입력했습니다.<br/>
            입력하신 내용을 다시 확인해주세요.</small>
          </div>
        </Alert>
  );
};

export default DefaultAlerts;
