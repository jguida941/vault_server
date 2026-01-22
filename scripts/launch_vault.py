#!/usr/bin/env python3
"""
The Vault - Easy Launch Script
Starts the vault server and opens it in your browser
"""

import subprocess
import time
import webbrowser
import os
import sys
import signal
import atexit
import socket

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
BOLD = '\033[1m'
RESET = '\033[0m'

server_process = None

def cleanup():
    """Clean up server process on exit"""
    global server_process
    if server_process:
        print(f"\n{YELLOW}Shutting down vault server...{RESET}")
        server_process.terminate()
        try:
            server_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server_process.kill()
        print(f"{GREEN}[OK] Server stopped{RESET}")

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    cleanup()
    sys.exit(0)

def check_node():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"{GREEN}[OK] Node.js found: {result.stdout.strip()}{RESET}")
            return True
    except FileNotFoundError:
        pass

    print(f"{RED}[ERROR] Node.js not found!{RESET}")
    print(f"{YELLOW}Please install Node.js from https://nodejs.org/{RESET}")
    return False

def check_port(port=8888):
    """Check if port is in use and kill process if needed"""
    try:
        # Try to bind to the port
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', port))
        sock.close()

        if result == 0:
            print(f"{YELLOW}[WARN] Port {port} is already in use{RESET}")
            print(f"{YELLOW}Finding and stopping existing process...{RESET}")

            # Kill existing process on the port
            try:
                if sys.platform == "darwin":  # macOS
                    cmd = f"lsof -ti:{port} | xargs kill -9"
                else:  # Linux
                    cmd = f"fuser -k {port}/tcp"

                subprocess.run(cmd, shell=True, capture_output=True)
                time.sleep(1)
                print(f"{GREEN}[OK] Cleared port {port}{RESET}")
            except Exception as e:
                print(f"{RED}[ERROR] Could not clear port: {e}{RESET}")
                return False
    except Exception:
        pass  # Port is free

    return True

def check_dependencies():
    """Check if npm dependencies are installed"""
    # Get project root (parent of scripts directory)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    node_modules = os.path.join(project_root, 'node_modules')

    if not os.path.exists(node_modules):
        print(f"{YELLOW}Installing dependencies...{RESET}")
        subprocess.run(['npm', 'install'], cwd=project_root)
        print(f"{GREEN}[OK] Dependencies installed{RESET}")

def start_server():
    """Start the vault server"""
    global server_process

    print(f"{BLUE}Starting The Vault server...{RESET}")

    # Start server from project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    server_process = subprocess.Popen(
        ['node', 'server.js'],
        cwd=project_root,
        env={**os.environ, 'PORT': '8888'}
    )

    # Wait for server to start
    time.sleep(2)

    # Check if server is running
    if server_process.poll() is None:
        print(f"{GREEN}[OK] Server is running!{RESET}")
        print(f"{BLUE}The Vault is ready at: http://localhost:8888{RESET}")
        return True
    else:
        print(f"{RED}[ERROR] Server failed to start{RESET}")
        return False

def main():
    """Main launch function"""
    print(f"{BLUE}{'='*50}{RESET}")
    print(f"{BOLD}{YELLOW}THE VAULT - YouTube Music Player{RESET}")
    print(f"{BLUE}{'='*50}{RESET}\n")

    # Change to project root directory (parent of scripts/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)

    # Check requirements
    if not check_node():
        return

    check_dependencies()

    # Check and clear port if needed
    if not check_port(8888):
        print(f"{RED}[ERROR] Could not clear port 8888{RESET}")
        return

    # Register cleanup handlers
    atexit.register(cleanup)
    signal.signal(signal.SIGINT, signal_handler)

    # Start server
    if start_server():
        # Open in browser
        print(f"{YELLOW}Opening in browser...{RESET}")
        time.sleep(1)
        webbrowser.open('http://localhost:8888')

        print(f"\n{GREEN}{'='*50}{RESET}")
        print(f"{YELLOW}The Vault is now running!{RESET}")
        print(f"{BLUE}Press Ctrl+C to stop the server{RESET}")
        print(f"{GREEN}{'='*50}{RESET}\n")

        # Keep script running
        try:
            server_process.wait()
        except KeyboardInterrupt:
            pass

if __name__ == "__main__":
    main()
