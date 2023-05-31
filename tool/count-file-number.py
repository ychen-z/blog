import os
import chardet
import time

# 如何运行：
# 确保 python已经安装
# macos brew install python
# step1: 安装 pip3 install chardet
# step2: 执行python3 index.py 

# @author: hzzhangzhang1    
# 统计文件行数
# 过滤图片、文档、音频、视频等
extensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.svg', '.gif','.pdf','.doc','.docx','.xls','.xlsx']

# 获取当前时间戳
timestamp = time.strftime('%Y-%m-%d_%H-%M-%S')

def count_lines(path):
    count = 0
    with open(path, 'rb') as f:
        encoding = chardet.detect(f.read())['encoding']
    
    with open(path, "r", encoding=encoding) as f:
        count = sum(1 for line in f)
    return count

# 遍历文件夹并生成表格
def walk(path, table):
    for root, dirs, files in os.walk(path):
        if ".umi" in dirs:
            dirs.remove(".umi")
        if "node_modules" in dirs:
            dirs.remove("node_modules")
        for file in files:
            # Check if file extension matches any of the specified extensions
            if any(file.endswith(ext) for ext in extensions):
                continue
            file_path = os.path.join(root, file)
            line_count = count_lines(file_path)
            if line_count > 1000:
                table.append((file_path, line_count, "超过1000行"))
            elif line_count > 500:
                table.append((file_path, line_count, "超过500行"))
            elif line_count > 100:
                table.append((file_path, line_count, "超过100行"))
            else:
                table.append((file_path, line_count, "--"))
    return table

def traverse_directory(path, filename):
    table = walk(path, [])
    with open(f'{filename}_{timestamp}.txt', "w", encoding="utf-8") as f:
        f.write("{:<70}{:<10}{:<10}".format("文件路径", "文件行数", "备注")+ "\n")
        for row in table:
            f.write("{:<70}{:<10}{:<10}".format(row[0], row[1], row[2]) + "\n")

if __name__ == "__main__":
    directory = './src'
    traverse_directory(directory, 'file_path')
