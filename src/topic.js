import React from 'react';
import { List, Edit, Create, Datagrid, ReferenceField, TextField, EditButton, DisabledInput, LongTextInput, ReferenceInput, SelectInput, SimpleForm, TextInput,ImageField,ImageInput,DateField,DateInput} from 'admin-on-rest';

const TopicUrlField = ({ source, record = {} }) => <a>{`http://baidu.com/${record[source]}`}</a>;


export const TopicList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TopicUrlField source="id" label="帖子链接"/>
            <TextField source="name" />
            <TextField source="content" />
            <TextField source="summary" />
            <ImageField source="bannerImg" />
            <DateField source="beginTime" />
            <EditButton />
        </Datagrid>
    </List>
);

export const TopicListEdit = (props) => {
  return  <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" />
            <TextInput source="summary" />
            <TextInput source="content" />
            <DateInput source="beginTime" format={(d)=>{
                console.log(1,d);
                return d;
            }} parse={(d)=>{
                return d?d.replace("T",' ').replace(/\.\d+Z/,''):d;
            }}/>
            {/* <ImageInput source="bannerImg" /> */}
        </SimpleForm>
    </Edit>
};