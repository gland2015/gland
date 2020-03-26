import React from "react";
import { Pagination } from "antd";
import "antd/dist/antd.css";
import { Button } from "@material-ui/core";
// 3.3KΩ(332) ±5% FH(风华) 0603	
export default function() {
    const [total, setTotal] = React.useState(500);

    return (
        <div>
            <Pagination
                showQuickJumper
                showSizeChanger
                showTotal={function(total, range) {
                    //console.log('sss', total, range)
                    return 33;
                }}
                current={50}
                defaultPageSize={10}
                total={total}
                onShowSizeChange={function(current, size) {
                    console.log(current, size);
                }}
                onChange={onChange}
            />
            <Button
                onClick={function() {
                    setTotal(total - 100);
                }}
            >
                test
            </Button>
        </div>
    );

    function onChange(pageNumber) {
        console.log("pageNumber", pageNumber);
    }
}
