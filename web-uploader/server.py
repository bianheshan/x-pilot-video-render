#!/usr/bin/env python3
"""
场景上传管理器 - Web API 服务器

提供 RESTful API 接口，供前端调用 push_scene.py 功能
"""

import sys
from pathlib import Path

# 添加父目录到 Python 路径，以便导入 push_scene
sys.path.insert(0, str(Path(__file__).parent.parent))

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from push_scene import ScenePusher
import json

app = Flask(__name__, static_folder='.')
CORS(app)  # 允许跨域请求

# 初始化 ScenePusher
PROJECT_ROOT = Path(__file__).parent.parent
pusher = ScenePusher(str(PROJECT_ROOT))


@app.route('/')
def index():
    """首页 - 返回 Web 界面"""
    return send_from_directory('.', 'index.html')


@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'message': 'Scene Uploader API is running'
    })


@app.route('/scenes', methods=['GET'])
def get_scenes():
    """获取所有场景列表"""
    try:
        manifest = pusher._load_manifest()
        return jsonify({
            'success': True,
            'scenes': manifest.get('scenes', []),
            'manifest': manifest
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/push', methods=['POST'])
def push_scene():
    """推送单个场景"""
    try:
        data = request.json
        
        # 验证必填字段
        required_fields = ['scene_id', 'scene_name', 'duration', 'code_content']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'缺少必填字段: {field}'
                }), 400
        
        # 推送场景
        success = pusher.push(
            scene_id=data['scene_id'],
            scene_name=data['scene_name'],
            duration=int(data['duration']),
            code_content=data['code_content'],
            filename=data.get('filename'),
            props=data.get('props'),
            theme=data.get('theme')
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': f'场景 {data["scene_name"]} 推送成功'
            })
        else:
            return jsonify({
                'success': False,
                'message': '推送失败'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/push-batch', methods=['POST'])
def push_batch():
    """批量推送场景"""
    try:
        data = request.json
        
        if 'scenes' not in data or not isinstance(data['scenes'], list):
            return jsonify({
                'success': False,
                'message': '请提供 scenes 数组'
            }), 400
        
        scenes = data['scenes']
        success_count = pusher.push_batch(scenes)
        
        return jsonify({
            'success': True,
            'message': f'批量推送完成',
            'success_count': success_count,
            'total': len(scenes)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/delete/<scene_id>', methods=['DELETE'])
def delete_scene(scene_id):
    """删除场景"""
    try:
        manifest = pusher._load_manifest()
        scenes = manifest.get('scenes', [])
        
        # 查找场景
        scene_index = next(
            (i for i, s in enumerate(scenes) if s['id'] == scene_id),
            None
        )
        
        if scene_index is None:
            return jsonify({
                'success': False,
                'message': f'场景 {scene_id} 不存在'
            }), 404
        
        # 删除场景文件
        scene = scenes[scene_index]
        scene_file = pusher.scenes_dir / scene['component']
        if scene_file.exists():
            scene_file.unlink()
        
        # 从 manifest 中移除
        scenes.pop(scene_index)
        manifest['scenes'] = scenes
        pusher._save_manifest(manifest)
        
        return jsonify({
            'success': True,
            'message': f'场景 {scene_id} 已删除'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/set-theme', methods=['POST'])
def set_theme():
    """设置主题"""
    try:
        data = request.json
        
        if 'theme' not in data:
            return jsonify({
                'success': False,
                'message': '请提供 theme 参数'
            }), 400
        
        theme = data['theme']
        success = pusher.set_theme(theme)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'主题已设置为: {theme}'
            })
        else:
            return jsonify({
                'success': False,
                'message': '设置主题失败'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/get-theme', methods=['GET'])
def get_theme():
    """获取当前主题"""
    try:
        theme = pusher.get_theme()
        return jsonify({
            'success': True,
            'theme': theme
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/manifest', methods=['GET'])
def get_manifest():
    """获取完整的 manifest.json"""
    try:
        manifest = pusher._load_manifest()
        return jsonify({
            'success': True,
            'manifest': manifest
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/test/validate', methods=['POST'])
def validate_code():
    """验证场景代码语法"""
    try:
        data = request.json
        code_content = data.get('code_content', '')
        
        if not code_content:
            return jsonify({
                'success': False,
                'message': '代码内容不能为空'
            }), 400
        
        # 基本语法检查
        errors = []
        warnings = []
        
        # 检查必要的导入
        if 'import React' not in code_content and 'import * as React' not in code_content:
            errors.append('缺少 React 导入')
        
        if 'from "remotion"' not in code_content and 'from \'remotion\'' not in code_content:
            warnings.append('建议导入 Remotion 组件（如 AbsoluteFill）')
        
        # 检查导出
        if 'export default' not in code_content:
            errors.append('缺少默认导出（export default）')
        
        # 检查函数组件
        if 'function' not in code_content and 'const' not in code_content and '=>' not in code_content:
            errors.append('未找到 React 组件定义')
        
        # 检查 JSX 返回
        if 'return' not in code_content:
            warnings.append('组件可能缺少 return 语句')
        
        return jsonify({
            'success': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'message': '代码验证完成' if len(errors) == 0 else '代码存在错误'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'验证失败: {str(e)}'
        }), 500


@app.route('/test/preview-status', methods=['GET'])
def preview_status():
    """检查 Remotion Studio 是否运行"""
    import subprocess
    try:
        # 检查端口 3000 是否被占用（Remotion Studio 默认端口）
        result = subprocess.run(
            ['lsof', '-i', ':3000'],
            capture_output=True,
            text=True,
            timeout=2
        )
        
        is_running = result.returncode == 0 and 'node' in result.stdout.lower()
        
        return jsonify({
            'success': True,
            'is_running': is_running,
            'port': 3000,
            'url': 'http://localhost:3000' if is_running else None
        })
    except Exception as e:
        return jsonify({
            'success': True,
            'is_running': False,
            'message': str(e)
        })


@app.route('/test/start-preview', methods=['POST'])
def start_preview():
    """启动 Remotion Studio 预览"""
    import subprocess
    import threading
    
    try:
        # 检查是否已经运行
        check_result = subprocess.run(
            ['lsof', '-i', ':3000'],
            capture_output=True,
            text=True,
            timeout=2
        )
        
        if check_result.returncode == 0 and 'node' in check_result.stdout.lower():
            return jsonify({
                'success': True,
                'message': 'Remotion Studio 已在运行',
                'url': 'http://localhost:3000',
                'already_running': True
            })
        
        # 在后台启动 npm run dev
        def run_dev_server():
            subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=str(PROJECT_ROOT),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        
        thread = threading.Thread(target=run_dev_server, daemon=True)
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Remotion Studio 正在启动...',
            'url': 'http://localhost:3000',
            'wait_time': 5,
            'already_running': False
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'启动失败: {str(e)}'
        }), 500


@app.route('/test/workflow', methods=['POST'])
def test_workflow():
    """完整测试工作流：上传 → 验证 → 启动预览"""
    try:
        data = request.json
        
        # 1. 验证代码
        code_content = data.get('code_content', '')
        errors = []
        
        if 'import React' not in code_content:
            errors.append('缺少 React 导入')
        if 'export default' not in code_content:
            errors.append('缺少默认导出')
        
        if errors:
            return jsonify({
                'success': False,
                'step': 'validate',
                'message': '代码验证失败',
                'errors': errors
            }), 400
        
        # 2. 推送场景
        success = pusher.push(
            scene_id=data['scene_id'],
            scene_name=data['scene_name'],
            duration=int(data['duration']),
            code_content=code_content,
            filename=data.get('filename'),
            props=data.get('props'),
            theme=data.get('theme')
        )
        
        if not success:
            return jsonify({
                'success': False,
                'step': 'upload',
                'message': '场景上传失败'
            }), 500
        
        # 3. 检查预览服务器状态
        import subprocess
        check_result = subprocess.run(
            ['lsof', '-i', ':3000'],
            capture_output=True,
            text=True,
            timeout=2
        )
        
        is_running = check_result.returncode == 0 and 'node' in check_result.stdout.lower()
        
        return jsonify({
            'success': True,
            'step': 'complete',
            'message': '测试工作流完成',
            'preview_running': is_running,
            'preview_url': 'http://localhost:3000' if is_running else None,
            'scene_id': data['scene_id']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'工作流执行失败: {str(e)}'
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 场景上传管理器 API 服务器")
    print("=" * 60)
    print(f"📁 项目根目录: {PROJECT_ROOT}")
    print(f"📂 场景目录: {pusher.scenes_dir}")
    print(f"📄 Manifest: {pusher.manifest_path}")
    print("=" * 60)
    print("🌐 API 端点:")
    print("  GET  /health              - 健康检查")
    print("  GET  /scenes              - 获取场景列表")
    print("  POST /push                - 推送单个场景")
    print("  POST /push-batch          - 批量推送场景")
    print("  DELETE /delete/<id>       - 删除场景")
    print("  POST /set-theme           - 设置主题")
    print("  GET  /get-theme           - 获取主题")
    print("  GET  /manifest            - 获取 manifest")
    print("")
    print("  🧪 测试工作流端点:")
    print("  POST /test/validate       - 验证场景代码")
    print("  GET  /test/preview-status - 检查预览状态")
    print("  POST /test/start-preview  - 启动预览服务器")
    print("  POST /test/workflow       - 完整测试工作流")
    print("=" * 60)
    print("🔗 访问地址: http://localhost:8000")
    print("🌐 前端界面: http://localhost:8000/")
    print("=" * 60)
    print()
    
    # 启动服务器
    app.run(host='0.0.0.0', port=8000, debug=True)
