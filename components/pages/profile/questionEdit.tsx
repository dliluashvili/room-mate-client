import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const QuestionEdit = () => {
    let { t } = useTranslation('common');

    return (
        <div>
            <h1 className="mt-5">{t('answer_edit_under_construction')}</h1>
        </div>
    );
};
export default QuestionEdit;
